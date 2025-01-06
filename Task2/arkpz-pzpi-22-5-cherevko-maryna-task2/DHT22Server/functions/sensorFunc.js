const Sensor = require("../models/Sensor");

async function getAllSensors() {
    return await Sensor.findAll();
}

module.exports = {
    getAllSensors
};