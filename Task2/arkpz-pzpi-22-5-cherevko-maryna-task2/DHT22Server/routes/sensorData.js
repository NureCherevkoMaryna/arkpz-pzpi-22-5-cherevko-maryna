const express = require("express");
const router = express.Router();
const {sequelize} = require("../config/database");
const SensorData = require("../models/SensorData");

router.get("/getAllSensorData", async (req, res) => {
    try {
        const sensorData = SensorData.findAll();
        res.json(sensorData)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.get("/getSensorDataById/dataid", async (req, res) => {
    try {
        const data_id = req.params.sensordataid;
        const sensorData = SensorData.findByPk(data_id);
        res.json(sensorData)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.get("/getSensorDataBySensorId/:sensorid", async (req, res) => {
    try {
        const sensor_id = req.params.sensorid;
        const [sensorData] = await sequelize.query(
            `SELECT * FROM SensorData WHERE sensor_id = :sensor_id`,
            {
                replacements: { sensor_id },
            }
        );
        res.json(sensorData)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

module.exports = router;