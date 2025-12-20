const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SiteConfig = sequelize.define('SiteConfig', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cms_visibility: {
        type: DataTypes.JSON,
        defaultValue: {
            hero: true,
            numbers: true,
            whyUs: true,
            benefits: true,
            howEasy: true
        }
    },
    header_scripts: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fb_pixel_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fb_capi_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    landing_content: {
        type: DataTypes.JSON,
        defaultValue: {
            hero: {
                title: "Scale Your Impact with AI WhatsApp Automation.",
                subtitle: "The ultimate edge-computing platform for high-performance messaging, automated workflows, and global connectivity.",
                cta_primary: "Claim Your Node",
                cta_secondary: "Watch Transmission"
            },
            numbers: {
                title1: "15M+",
                label1: "Packets Routed",
                title2: "99.9%",
                label2: "System Uptime",
                title3: "128k+",
                label3: "Active Segments"
            },
            whyUs: {
                title: "Engineered for Resilience.",
                subtitle: "Our architecture is built on top of the latest edge-computing standards, ensuring your messages always reach their destination.",
                card1_title: "Global Edge Network",
                card1_desc: "Distributed nodes across 12+ regions for 0ms latency.",
                card2_title: "Enterprise Encryption",
                card2_desc: "End-to-end security protocols for every transmission.",
                card3_title: "Smart Automations",
                card3_desc: "Build complex workflows with our visual logic engine."
            },
            benefits: {
                title: "Data that drives Conversions.",
                subtitle: "Our advanced routing engine doesn't just send messages—it tracks every interaction. See exactly which agent is closing deals and which campaigns are performing.",
                stat1_title: "99.9%",
                stat1_label: "Delivery Rate",
                stat2_title: "< 2s",
                stat2_label: "Avg Response",
                mission_title: "Why We Exist.",
                mission_text: "In the age of scattered attention, WhatsApp is the only place left where people actually listen. We built WaMate to turn this personal connection into a scalable enterprise asset."
            },
            numbers: {
                title: "GLOBAL INFRASTRUCTURE",
                stat1_title: "99.99%",
                stat1_label: "Uptime Record",
                stat2_title: "24/7",
                stat2_label: "Human Support",
                stat3_title: "<10ms",
                stat3_label: "Global Latency"
            },
            howEasy: {
                title: "Brand Success Stories.",
                case1_brand: "TESLA",
                case1_stat: "92% Automation",
                case1_text: "Implementing WaMate for our customer service simplified the entire delivery process. Automation at its finest.",
                case1_footer: "PRODUCTION LINE AUTOMATION",
                case2_brand: "VOGUE",
                case2_stat: "Media Focus",
                case2_text: "Speed is everything in fashion. WaMate gives us the response time our clients demand.",
                case2_footer: "HIGH-FASHION CUSTOMER CARE"
            }
        }
    },
    smtp_settings: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null
    }
}, {
    timestamps: true,
    tableName: 'site_configs'
});

module.exports = SiteConfig;
