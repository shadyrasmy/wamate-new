const { User, Plan, Invoice } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const emailService = require('../services/email.service');

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
        const fawaterakResponse = await fetch('https://app.fawaterk.com/api/v2/invoiceInitPay', {
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
        const response = await fetch(`https://app.fawaterk.com/api/v2/getInvoiceData/${invoice.fawaterak_invoice_id}`, {
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
