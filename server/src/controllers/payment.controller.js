const { User, Plan, Invoice, ReferralTransaction, SiteConfig } = require('../models');
const { sequelize } = require('../config/db');
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

        const FAWATERAK_API_KEY = process.env.FAWATERAK_API_KEY;
        if (!FAWATERAK_API_KEY) {
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
        const redirectUrl = success_url || `${baseUrl}/payment/success`;
        const failureUrl = fail_url || `${baseUrl}/payment/failed`;

        // Create Fawaterak invoice
        const fawaterakResponse = await fetchWithRetry('https://app.fawaterk.com/api/v2/invoiceInitPay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FAWATERAK_API_KEY}`
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
                currency: 'USD'
            })
        });

        const fawaterakData = await fawaterakResponse.json();
        console.log('Fawaterak response:', fawaterakData);

        if (fawaterakData.status !== 'success') {
            return next(new AppError('Failed to create payment invoice: ' + JSON.stringify(fawaterakData), 400));
        }

        const paymentUrl = (fawaterakData.data?.invoice_id && fawaterakData.data?.invoice_key)
            ? `https://app.fawaterk.com/invoice/${fawaterakData.data.invoice_id}/${fawaterakData.data.invoice_key}`
            : (fawaterakData.data?.payment_data?.redirectTo || fawaterakData.data?.url);

        const fawaterakInvoiceId = fawaterakData.data?.invoice_id?.toString();

        // Calculate billing period
        const startDate = new Date();
        const endDate = calculateEndDate(startDate, plan.billing_cycle);

        // Create pending invoice in database
        const invoice = await Invoice.create({
            user_id: userId,
            invoice_number: generateInvoiceNumber(),
            amount: plan.price,
            currency: 'USD',
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

        const { invoice_id, invoice_status, payment_method } = req.body;

        if (!invoice_id) {
            return res.status(400).json({ status: 'error', message: 'Missing invoice_id' });
        }

        // Find invoice by Fawaterak invoice ID
        const invoice = await Invoice.findOne({
            where: { fawaterak_invoice_id: invoice_id.toString() }
        });

        if (!invoice) {
            console.warn(`Invoice not found for Fawaterak ID: ${invoice_id}`);
            return res.status(404).json({ status: 'error', message: 'Invoice not found' });
        }

        // Verify with Fawaterak API to prevent spoofing
        const FAWATERAK_API_KEY = process.env.FAWATERAK_API_KEY;
        if (!FAWATERAK_API_KEY) {
            console.error('FAWATERAK_API_KEY mismatch or missing during webhook verification');
            // We might choose to return 500 or just log checking configuration
        } else {
            try {
                const verifyRes = await fetchWithRetry(`https://app.fawaterk.com/api/v2/getInvoiceData/${invoice_id}`, {
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
        const isPaid = invoice_status === 'paid' || invoice_status === 'PAID';

        if (isPaid && invoice.status !== 'paid') {
            // Upgrade user plan
            try {
                await upgradeUserPlan(invoice.user_id, invoice.plan_id);

                // Update invoice
                await invoice.update({
                    status: 'paid',
                    paid_at: new Date()
                });

                console.log(`✅ Payment successful for invoice ${invoice.invoice_number}`);

                // --- REFERRAL COMMISSION LOGIC ---
                try {
                    const user = await User.findByPk(invoice.user_id);
                    if (user && user.referred_by) {
                        const referrer = await User.findByPk(user.referred_by);
                        if (referrer) {
                            // Get Commission Config
                            const config = await SiteConfig.findOne();
                            const percentage = config ? config.referral_commission_percentage : 20;

                            // Calculate Commission
                            const commissionAmount = (Number(invoice.amount) * percentage) / 100;

                            if (commissionAmount > 0) {
                                // Update Referrer Balance
                                await referrer.increment('referral_balance', { by: commissionAmount });

                                // Log Transaction
                                await ReferralTransaction.create({
                                    referrer_id: referrer.id,
                                    referred_user_id: user.id,
                                    amount: commissionAmount,
                                    percentage: percentage,
                                    type: 'commission',
                                    status: 'completed',
                                    note: `Commission for invoice ${invoice.invoice_number}`
                                });

                                // Send Email to Referrer
                                try {
                                    await emailService.sendTemplate(referrer.email, 'referral_earned', {
                                        name: referrer.name,
                                        amount: `$${commissionAmount.toFixed(2)}`,
                                        plan_name: invoice.plan_name
                                    });
                                } catch (emailErr) {
                                    console.warn('Failed to send referral email:', emailErr.message);
                                }

                                console.log(`💰 Commission of $${commissionAmount} added to referrer ${referrer.id}`);
                            }
                        }
                    }
                } catch (referralError) {
                    console.error('Error processing referral commission:', referralError);
                    // Do not fail the webhook request just because referral failed
                }
                // ---------------------------------
            } catch (upgradeError) {
                console.error('Failed to upgrade user:', upgradeError);
                await invoice.update({ status: 'failed' });
                return res.status(500).json({ status: 'error', message: 'Failed to process upgrade' });
            }
        } else if (invoice_status === 'failed' || invoice_status === 'FAILED') {
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

        const FAWATERAK_API_KEY = process.env.FAWATERAK_API_KEY;
        if (!FAWATERAK_API_KEY) {
            return next(new AppError('Payment gateway not configured', 500));
        }

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

        // Verify with Fawaterak
        const response = await fetchWithRetry(`https://app.fawaterk.com/api/v2/getInvoiceData/${invoice.fawaterak_invoice_id}`, {
            headers: {
                'Authorization': `Bearer ${FAWATERAK_API_KEY}`
            }
        });

        const data = await response.json();

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
