const { DataTypes } = require('sequelize');
const User = require("./User");
const Sensor = require("./Sensor");
const { sequelize } = require('../config/database');

const UserSensor = sequelize.define('UserSensor', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        }
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sensor,
            key: 'sensor_id',
        }
    }
}, {
    tableName: 'UserSensor',
    timestamps: false,
});

module.exports = UserSensor;