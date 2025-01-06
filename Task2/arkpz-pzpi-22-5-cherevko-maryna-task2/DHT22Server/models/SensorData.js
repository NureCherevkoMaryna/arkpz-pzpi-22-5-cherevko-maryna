const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Sensor = require("./Sensor");

const SensorData = sequelize.define('SensorData', {
    data_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sensor,
            key: 'sensor_id',
        }
    },
    record_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    temperature: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    humidity: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    }
}, {
    tableName: 'SensorData',
    timestamps: false,
});

module.exports = SensorData;