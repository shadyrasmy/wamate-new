const Joi = require('joi');

const createInstanceSchema = Joi.object({
    instanceName: Joi.string().min(2).max(50).optional()
});

const updateInstanceSchema = Joi.object({
    name: Joi.string().min(2).max(50).required()
});

const pairingCodeSchema = Joi.object({
    phoneNumber: Joi.string().min(10).required()
});

const toggleChatSchema = Joi.object({
    enabled: Joi.boolean().required()
});

module.exports = {
    createInstanceSchema,
    updateInstanceSchema,
    pairingCodeSchema,
    toggleChatSchema
};
