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

const updateUserPlanSchema = Joi.object({
    id_plan: Joi.string().uuid().required()
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
    updateUserPlanSchema,
    banUserSchema,
    extendSubscriptionSchema,
    updateSiteConfigSchema
};
