const { DataTypes } = require('sequelize');
const User = require("./User");
const NotificationSettings = require("./NotificationSettings");
const { sequelize } = require('../config/database');

const Alert = sequelize.define('Alert', {
    alert_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    triggered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    alert_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    alert_message: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        }
    },
    notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: NotificationSettings,
            key: 'notification_id',
        }
    },
    resolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
    }
}, {
    tableName: 'Alerts',
    timestamps: false,
});

module.exports = Alert;