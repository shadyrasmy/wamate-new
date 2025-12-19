const User = require('./User');
const WhatsAppInstance = require('./WhatsAppInstance');
const SiteConfig = require('./SiteConfig');
const Seat = require('./Seat');
const Contact = require('./Contact');
const { Message, MessageLog } = require('./Message');
const Plan = require('./Plan');
const Invoice = require('./Invoice');
const { sequelize } = require('../config/db');

// User -> Instances
User.hasMany(WhatsAppInstance, { foreignKey: 'user_id', as: 'instances' });
WhatsAppInstance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User -> Seats
User.hasMany(Seat, { foreignKey: 'user_id', as: 'seats' });
Seat.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Instance -> Seat (A seat is assigned to an instance)
WhatsAppInstance.hasOne(Seat, { foreignKey: 'instance_id', as: 'seat' });
Seat.belongsTo(WhatsAppInstance, { foreignKey: 'instance_id', as: 'instance' });

// Instance -> Contacts
WhatsAppInstance.hasMany(Contact, { foreignKey: 'instance_id', as: 'contacts' });
Contact.belongsTo(WhatsAppInstance, { foreignKey: 'instance_id', as: 'instance' });

// Instance -> Messages
WhatsAppInstance.hasMany(Message, { foreignKey: 'instance_id', as: 'messages' });
Message.belongsTo(WhatsAppInstance, { foreignKey: 'instance_id', as: 'instance' });

// User -> Messages/Contacts (Persistence)
User.hasMany(Message, { foreignKey: 'user_id', as: 'all_messages' });
Message.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Contact, { foreignKey: 'user_id', as: 'all_contacts' });
Contact.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Message -> Quoted Message (Self reference for replies)
// We must target 'message_id' because 'quoted_message_id' contains the Baileys stanzaId (String)
// We use constraints: false because 'message_id' is not a primary key, avoiding index requirements in some DB engines
Message.belongsTo(Message, { foreignKey: 'quoted_message_id', targetKey: 'message_id', as: 'quotedMessage', constraints: false });

// User/Instance -> MessageLogs
User.hasMany(MessageLog, { foreignKey: 'user_id', as: 'logs' });
MessageLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

WhatsAppInstance.hasMany(MessageLog, { foreignKey: 'instance_id', as: 'instance_logs' });
MessageLog.belongsTo(WhatsAppInstance, { foreignKey: 'instance_id', as: 'instance' });

// User -> Invoices
User.hasMany(Invoice, { foreignKey: 'user_id', as: 'invoices' });
Invoice.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Export everything
module.exports = {
    sequelize,
    User,
    WhatsAppInstance,
    Seat,
    Contact,
    Message,
    MessageLog,
    Plan,
    Invoice,
    SiteConfig
};
