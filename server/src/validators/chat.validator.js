const Joi = require('joi');

const sendMessageSchema = Joi.object({
    instanceId: Joi.string().uuid().required(),
    jid: Joi.string().optional(),
    number: Joi.string().optional(),
    content: Joi.string().optional(),
    message: Joi.string().optional(),
    type: Joi.string().valid('text', 'image', 'video', 'audio', 'document', 'reaction').default('text'),
    mediaUrl: Joi.string().uri().optional(),
    reaction: Joi.object({
        text: Joi.string().required(),
        key: Joi.object().required()
    }).optional(),
    quotedMessageId: Joi.string().optional()
}).xor('jid', 'number').or('content', 'message', 'reaction');

const resolveChatSchema = Joi.object({
    jid: Joi.string().required()
});

module.exports = {
    sendMessageSchema,
    resolveChatSchema
};
