const { User, Plan, Invoice, ReferralTransaction, SiteConfig } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const emailService = require('../services/email.service');
const { fetchWithRetry } = require('../utils/http');

// Helper: Calculate subscription end date based on billing cycle
const calculateEndDate = (startDate, billingCycle) => {
    const end = new Date(startDate);
    switch (billingCycle) {
        case 'monthly':
            end.setDate(end.getDate() + 30);
            break;
        case 'quarterly':
            end.setDate(end.getDate() + 90);
            break;
        case 'yearly':
            end.setDate(end.getDate() + 365);
            break;
        case 'lifetime':
            end.setFullYear(2099, 11, 31);
            break;
        default:
            end.setDate(end.getDate() + 30);
    }
    return end;
};

// Helper: Generate unique invoice number
const generateInvoiceNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${timestamp}-${random}`;
};

const getEnv = (...names) => names.map(name => process.env[name]).find(Boolean);

const getFawaterkBaseUrl = () => (
    getEnv('FAWATERAK_BASE_URL', 'FAWATERK_BASE_URL') || 'https://app.fawaterk.com'
).replace(/\/$/, '');

const getFawaterkClientId = () => getEnv('FAWATERAK_CLIENT_ID', 'FAWATERK_CLIENT_ID');
const getFawaterkClientSecret = () => getEnv('FAWATERAK_CLIENT_SECRET', 'FAWATERK_CLIENT_SECRET');
const getFawaterkApiKey = () => getEnv('FAWATERAK_API_KEY', 'FAWATERK_API_KEY');

const usesFawaterkV3 = () => Boolean(getFawaterkClientId() && getFawaterkClientSecret());

let fawaterkTokenCache = {
    accessToken: null,
    expiresAt: 0
};

const getServerBaseUrl = (req) => (
    getEnv('PUBLIC_URL', 'API_PUBLIC_URL') || `${req.protocol}://${req.get('host')}`
).replace(/\/$/, '');

const parseJsonResponse = async (response) => {
    const text = await response.text();
    if (!text) return {};

    try {
        return JSON.parse(text);
    } catch (error) {
        return { raw: text };
    }
};

const getFawaterkAccessToken = async () => {
    const clientId = getFawaterkClientId();
    const clientSecret = getFawaterkClientSecret();

    if (!clientId || !clientSecret) {
        throw new AppError('Fawaterk OAuth credentials are not configured', 500);
    }

    if (fawaterkTokenCache.accessToken && Date.now() < fawaterkTokenCache.expiresAt) {
        return fawaterkTokenCache.accessToken;
    }

    const response = await fetchWithRetry(`${getFawaterkBaseUrl()}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        })
    });
    const data = await parseJsonResponse(response);

    if (!response.ok || !data.access_token) {
        throw new AppError(`Failed to authenticate with Fawaterk: ${JSON.stringify(data)}`, 502);
    }

    const expiresInSeconds = Number(data.expires_in || 3600);
    fawaterkTokenCache = {
        accessToken: data.access_token,
        expiresAt: Date.now() + Math.max(expiresInSeconds - 60, 60) * 1000
    };

    return data.access_token;
};

const getFawaterkAuthHeaders = async () => {
    if (usesFawaterkV3()) {
        const accessToken = await getFawaterkAccessToken();
        return { Authorization: `Bearer ${accessToken}` };
    }

    const apiKey = getFawaterkApiKey();
    if (!apiKey) {
        throw new AppError('Payment gateway not configured', 500);
    }

    return { Authorization: `Bearer ${apiKey}` };
};

const callFawaterk = async (path, options = {}) => {
    const response = await fetchWithRetry(`${getFawaterkBaseUrl()}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...await getFawaterkAuthHeaders(),
            ...options.headers
        }
    });
    const data = await parseJsonResponse(response);

    if (!response.ok) {
        throw new AppError(`Fawaterk request failed: ${JSON.stringify(data)}`, response.status || 502);
    }

    return data;
};

const getProviderReferenceFromWebhook = (body) => (
    body.transaction_key ||
    body.transactionKey ||
    body.intent_key ||
    body.invoice_id ||
    body.invoiceId
);

const getWebhookStatus = (body) => String(
    body.status ||
    body.invoice_status ||
    body.payment_status ||
    (body.errorMessage ? 'failed' : '') ||
    ''
).toLowerCase();

const parsePayLoad = (payLoad) => {
    if (!payLoad) return {};
    if (typeof payLoad === 'object') return payLoad;

    try {
        return JSON.parse(payLoad);
    } catch (error) {
        return {};
    }
};

const findInvoiceFromWebhook = async (body) => {
    const providerReference = getProviderReferenceFromWebhook(body);
    if (providerReference) {
        const invoice = await Invoice.findOne({
            where: { fawaterak_invoice_id: providerReference.toString() }
        });
        if (invoice) return invoice;
    }

    const payload = parsePayLoad(body.pay_load || body.payLoad);
    if (payload.invoice_number) {
        return Invoice.findOne({ where: { invoice_number: payload.invoice_number } });
    }

    if (payload.invoice_id) {
        return Invoice.findByPk(payload.invoice_id);
    }

    return null;
};

const getFawaterkTransactionData = async (intentKey) => {
    if (!usesFawaterkV3()) return null;

    return callFawaterk('/api/v3/getTransactionData', {
        method: 'POST',
        body: JSON.stringify({ intent_key: intentKey })
    });
};

const normalizeVerifiedStatus = (providerData) => {
    const data = providerData?.data || providerData;
    if (!data) return 'pending';
    if (data.paid === 1 || data.paid === true) return 'paid';
    if (typeof data.status_text === 'string') return data.status_text.toLowerCase();
    if (typeof data.status === 'string') return data.status.toLowerCase();
    return 'pending';
};

// Helper: Upgrade user plan
const upgradeUserPlan = async (userId, planId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const plan = await Plan.findByPk(planId);
    if (!plan) throw new Error('Plan not found');

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, plan.billing_cycle);

    await user.update({
        id_plan: plan.id,
        monthly_message_limit: plan.monthly_message_limit,
        max_instances: plan.max_instances,
        max_seats: plan.max_seats,
        subscription_start_date: startDate,
        subscription_end_date: endDate,
        messages_sent_current_period: 0 // Reset usage on new subscription
    });

    // Send subscription confirmation email
    try {
        await emailService.sendTemplate(user.email, 'subscription_purchase', {
            name: user.name,
            plan_name: plan.name,
            end_date: endDate.toLocaleDateString()
        });
    } catch (error) {
        console.warn('Failed to send subscription email:', error.message);
    }

    return { user, plan, endDate };
};

const processReferralCommission = async (invoice) => {
    try {
        const user = await User.findByPk(invoice.user_id);
        if (!user || !user.referred_by) return;

        const referrer = await User.findByPk(user.referred_by);
        if (!referrer) return;

        const config = await SiteConfig.findOne();
        const percentage = config ? config.referral_commission_percentage : 20;
        const commissionAmount = (Number(invoice.amount) * percentage) / 100;

        if (commissionAmount <= 0) return;

        await referrer.increment('referral_balance', { by: commissionAmount });

        await ReferralTransaction.create({
            referrer_id: referrer.id,
            referred_user_id: user.id,
            amount: commissionAmount,
            percentage,
            type: 'commission',
            status: 'completed',
            note: `Commission for invoice ${invoice.invoice_number}`
        });

        try {
            await emailService.sendTemplate(referrer.email, 'referral_earned', {
                name: referrer.name,
                amount: `$${commissionAmount.toFixed(2)}`,
                plan_name: invoice.plan_name
            });
        } catch (emailErr) {
            console.warn('Failed to send referral email:', emailErr.message);
        }

        console.log(`Commission of $${commissionAmount} added to referrer ${referrer.id}`);
    } catch (referralError) {
        console.error('Error processing referral commission:', referralError);
    }
};

const markInvoicePaid = async (invoice) => {
    await upgradeUserPlan(invoice.user_id, invoice.plan_id);
    await invoice.update({
        status: 'paid',
        paid_at: new Date()
    });

    console.log(`Payment successful for invoice ${invoice.invoice_number}`);
    await processReferralCommission(invoice);
};

/**
 * Create a Fawaterak invoice for plan upgrade
 * POST /api/payment/create-invoice
 */
exports.createInvoice = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { plan_id, success_url, fail_url } = req.body;

        if (!plan_id) {
            return next(new AppError('Plan ID is required', 400));
        }

        if (!usesFawaterkV3() && !getFawaterkApiKey()) {
            return next(new AppError('Payment gateway not configured', 500));
        }

        // Get user and plan
        const user = await User.findByPk(userId);
        if (!user) return next(new AppError('User not found', 404));

        const plan = await Plan.findByPk(plan_id);
        if (!plan) return next(new AppError('Plan not found', 404));

        // Prepare customer data for Fawaterak
        const nameParts = (user.name || user.email.split('@')[0]).split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';

        const cartItems = [{
            name: plan.name,
            price: Number(plan.price),
            quantity: 1
        }];

        const customer = {
            first_name: firstName,
            last_name: lastName,
            email: user.email,
            phone: user.phone_number || '01000000000',
            address: 'Egypt'
        };

        const baseUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:3000';
        const serverBaseUrl = getServerBaseUrl(req);
        const redirectUrl = success_url || `${baseUrl}/payment/success`;
        const failureUrl = fail_url || `${baseUrl}/payment/failed`;
        const invoiceNumber = generateInvoiceNumber();
        const currency = process.env.FAWATERAK_CURRENCY || process.env.FAWATERK_CURRENCY || 'USD';

        let fawaterakData;

        if (usesFawaterkV3()) {
            fawaterakData = await callFawaterk('/api/v3/createTransaction', {
                method: 'POST',
                body: JSON.stringify({
                    cartItems,
                    customer: {
                        ...customer,
                        customer_unique_id: user.id
                    },
                    redirectionUrls: {
                        successUrl: redirectUrl,
                        failUrl: failureUrl,
                        pendingUrl: redirectUrl,
                        webhookUrl: `${serverBaseUrl}/api/payment/webhook_json`
                    },
                    pay_load: {
                        invoice_number: invoiceNumber,
                        user_id: userId,
                        plan_id: plan.id
                    },
                    tr_number: invoiceNumber,
                    cartTotal: Number(plan.price),
                    currency,
                    list_style: process.env.FAWATERAK_LIST_STYLE || 'h'
                })
            });
        } else {
            const fawaterakResponse = await fetchWithRetry(`${getFawaterkBaseUrl()}/api/v2/invoiceInitPay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getFawaterkApiKey()}`
                },
                body: JSON.stringify({
                    payment_method_id: 2,
                    cartItems,
                    customer,
                    redirectionUrls: {
                        successUrl: redirectUrl,
                        failUrl: failureUrl,
                        pendingUrl: redirectUrl
                    },
                    cartTotal: Number(plan.price),
                    currency
                })
            });
            fawaterakData = await fawaterakResponse.json();
        }

        console.log('Fawaterak response:', fawaterakData);

        if (fawaterakData.status !== 'success') {
            return next(new AppError('Failed to create payment invoice: ' + JSON.stringify(fawaterakData), 400));
        }

        const paymentUrl = fawaterakData.data?.url ||
            fawaterakData.data?.short_url ||
            fawaterakData.data?.payment_data?.redirectTo ||
            (fawaterakData.data?.invoice_id && fawaterakData.data?.invoice_key
            ? `${getFawaterkBaseUrl()}/invoice/${fawaterakData.data.invoice_id}/${fawaterakData.data.invoice_key}`
            : null);

        const fawaterakInvoiceId = (
            fawaterakData.data?.intent_key ||
            fawaterakData.data?.transaction_key ||
            fawaterakData.data?.invoice_id
        )?.toString();

        if (!paymentUrl || !fawaterakInvoiceId) {
            return next(new AppError('Payment gateway response missing checkout URL or reference', 502));
        }

        // Calculate billing period
        const startDate = new Date();
        const endDate = calculateEndDate(startDate, plan.billing_cycle);

        // Create pending invoice in database
        const invoice = await Invoice.create({
            user_id: userId,
            invoice_number: invoiceNumber,
            amount: plan.price,
            currency,
            status: 'pending',
            plan_name: plan.name,
            plan_id: plan.id,
            fawaterak_invoice_id: fawaterakInvoiceId,
            payment_url: paymentUrl,
            billing_period_start: startDate,
            billing_period_end: endDate
        });

        res.status(200).json({
            status: 'success',
            data: {
                invoice_id: invoice.id,
                invoice_url: paymentUrl,
                fawaterak_invoice_id: fawaterakInvoiceId
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Fawaterak webhook callback
 * POST /api/payment/webhook (Public endpoint)
 */
exports.webhook = async (req, res, next) => {
    try {
        console.log('Fawaterak webhook received:', JSON.stringify(req.body, null, 2));

        const providerReference = getProviderReferenceFromWebhook(req.body);
        const webhookStatus = getWebhookStatus(req.body);
        if (!providerReference) {
            return res.status(400).json({ status: 'error', message: 'Missing provider transaction reference' });
        }

        const invoice = await findInvoiceFromWebhook(req.body);

        if (!invoice) {
            console.warn(`Invoice not found for Fawaterk reference: ${providerReference}`);
            return res.status(404).json({ status: 'error', message: 'Invoice not found' });
        }

        const invoice_id = providerReference.toString();
        const invoice_status = webhookStatus;

        if (usesFawaterkV3()) {
            try {
                const verifyData = await getFawaterkTransactionData(invoice_id);
                const actualStatus = normalizeVerifiedStatus(verifyData);

                if (actualStatus !== 'paid' && ['paid', 'success'].includes(webhookStatus)) {
                    console.warn(`Potential webhook spoofing: payload says paid, provider says ${actualStatus}. Invoice: ${invoice.invoice_number}`);
                    return res.status(400).json({ status: 'error', message: 'Verification failed' });
                }
            } catch (verifyErr) {
                console.error('Error verifying invoice with provider:', verifyErr);
                if (['paid', 'success'].includes(webhookStatus)) {
                    return res.status(502).json({ status: 'error', message: 'Unable to verify paid webhook with provider' });
                }
            }
        }

        // Verify with Fawaterak API to prevent spoofing
        const FAWATERAK_API_KEY = getFawaterkApiKey();
        if (usesFawaterkV3()) {
            // OAuth v3 verification already ran above.
        } else if (!FAWATERAK_API_KEY) {
            console.error('FAWATERAK_API_KEY mismatch or missing during webhook verification');
            // We might choose to return 500 or just log checking configuration
        } else {
            try {
                const verifyRes = await fetchWithRetry(`${getFawaterkBaseUrl()}/api/v2/getInvoiceData/${invoice_id}`, {
                    headers: { 'Authorization': `Bearer ${FAWATERAK_API_KEY}` }
                });
                const verifyData = await verifyRes.json();

                if (verifyData.status === 'success' && verifyData.data) {
                    // Check actual status from provider
                    const actualStatus = verifyData.data.paid ? 'paid' : (verifyData.data.status || 'pending');
                    if (actualStatus !== 'paid' && invoice_status === 'paid') {
                        console.warn(`⚠️ Potential Webhook Spoofing! Payload says paid, but API says ${actualStatus}. Invoice: ${invoice.invoice_number}`);
                        return res.status(400).json({ status: 'error', message: 'Verification failed' });
                    }
                } else {
                    console.warn(`Failed to verify invoice ${invoice_id} with Fawaterak.`);
                }
            } catch (verifyErr) {
                console.error('Error verifying invoice with provider:', verifyErr);
            }
        }

        // Check if payment was successful
        const isPaid = invoice_status === 'paid' || invoice_status === 'success';

        if (isPaid && invoice.status !== 'paid') {
            try {
                await markInvoicePaid(invoice);
                return res.status(200).json({ status: 'success', message: 'Webhook processed' });
            } catch (upgradeError) {
                console.error('Failed to upgrade user:', upgradeError);
                await invoice.update({ status: 'failed' });
                return res.status(500).json({ status: 'error', message: 'Failed to process upgrade' });
            }
        } else if (['failed', 'fail', 'cancelled', 'canceled', 'expired'].includes(invoice_status)) {
            await invoice.update({ status: 'failed' });
            console.log(`❌ Payment failed for invoice ${invoice.invoice_number}`);
        }

        res.status(200).json({ status: 'success', message: 'Webhook processed' });
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

/**
 * Verify payment status with Fawaterak
 * GET /api/payment/verify/:invoiceId
 */
exports.verifyPayment = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;

        // Get invoice from database
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) return next(new AppError('Invoice not found', 404));

        // If no Fawaterak ID, return local status
        if (!invoice.fawaterak_invoice_id) {
            return res.status(200).json({
                status: 'success',
                data: {
                    invoice_status: invoice.status,
                    local_only: true
                }
            });
        }

        if (!usesFawaterkV3() && !getFawaterkApiKey()) {
            return next(new AppError('Payment gateway not configured', 500));
        }

        // Verify with Fawaterak
        const data = usesFawaterkV3()
            ? await getFawaterkTransactionData(invoice.fawaterak_invoice_id)
            : await (async () => {
                const response = await fetchWithRetry(`${getFawaterkBaseUrl()}/api/v2/getInvoiceData/${invoice.fawaterak_invoice_id}`, {
                    headers: {
                        'Authorization': `Bearer ${getFawaterkApiKey()}`
                    }
                });
                return response.json();
            })();

        res.status(200).json({
            status: 'success',
            data: {
                invoice_id: invoice.id,
                invoice_number: invoice.invoice_number,
                local_status: invoice.status,
                fawaterak_data: data
            }
        });
    } catch (err) {
        next(err);
    }
};

// Export helper for admin approval
exports.upgradeUserPlan = upgradeUserPlan;
