const Joi = require('joi');

const createPlanSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    billing_cycle: Joi.string().valid('monthly', 'yearly').required(),
    max_instances: Joi.number().integer().min(1).required(),
    max_seats: Joi.number().integer().min(1).required(),
    monthly_message_limit: Joi.number().integer().min(0).required(),
    features: Joi.array().items(Joi.string()).optional()
});

const updatePlanSchema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    billing_cycle: Joi.string().valid('monthly', 'yearly').optional(),
    max_instances: Joi.number().integer().min(1).optional(),
    max_seats: Joi.number().integer().min(1).optional(),
    monthly_message_limit: Joi.number().integer().min(0).optional(),
    features: Joi.array().items(Joi.string()).optional()
}).unknown(true);

const updateUserPlanSchema = Joi.object({
    plan: Joi.string().optional(),
    phone_number: Joi.string().allow('', null).optional(),
    monthly_message_limit: Joi.number().integer().min(0).optional(),
    max_instances: Joi.number().integer().min(1).optional(),
    max_seats: Joi.number().integer().min(1).optional(),
    is_active: Joi.boolean().optional(),
    subscription_end_date: Joi.date().allow(null, '').optional(),
    id_plan: Joi.string().uuid().optional()
});

const banUserSchema = Joi.object({
    is_active: Joi.boolean().required()
});

const extendSubscriptionSchema = Joi.object({
    days: Joi.number().integer().min(1).required()
});

const updateSiteConfigSchema = Joi.object({
    cms_visibility: Joi.object().optional(),
    fb_capi_token: Joi.string().allow('', null).optional(),
    fb_pixel_id: Joi.string().allow('', null).optional(),
    header_scripts: Joi.string().allow('', null).optional(),
    landing_content: Joi.object().optional(),
    smtp_settings: Joi.object().allow(null).optional()
}).unknown(true);

module.exports = {
    createPlanSchema,
    updatePlanSchema,
    updateUserPlanSchema,
    banUserSchema,
    extendSubscriptionSchema,
    updateSiteConfigSchema
};
