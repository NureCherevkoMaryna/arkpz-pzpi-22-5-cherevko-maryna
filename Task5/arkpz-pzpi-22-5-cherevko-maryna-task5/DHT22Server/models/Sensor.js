const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sensor = sequelize.define('Sensor', {
    sensor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    device_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    temperature: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: null,
    },
    humidity: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: null,
    }
}, {
    tableName: 'Sensors',
    timestamps: false,
});

module.exports = Sensor;