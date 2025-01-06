const SensorData = require("../models/SensorData");

async function getAllSensorData() {
    return await SensorData.findAll();
}

module.exports = {
    getAllSensorData
};