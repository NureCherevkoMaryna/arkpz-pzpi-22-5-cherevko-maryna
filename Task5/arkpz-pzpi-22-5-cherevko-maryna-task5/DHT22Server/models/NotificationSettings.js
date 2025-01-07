const { DataTypes } = require('sequelize');
const Sensor = require("./Sensor");
const { sequelize } = require('../config/database');

const NotificationSettings = sequelize.define('NotificationSettings', {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    temperature_min: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    temperature_max: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    humidity_min: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    humidity_max: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sensor,
            key: 'sensor_id',
        }
    },
}, {
    tableName: 'NotificationSettings',
    timestamps: false,
});

module.exports = NotificationSettings;