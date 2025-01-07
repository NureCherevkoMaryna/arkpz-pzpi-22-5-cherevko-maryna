const express = require("express");
const router = express.Router();
const {sequelize} = require("../config/database");
const SensorData = require("../models/SensorData");
const Sensor = require("../models/Sensor");

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
            `SELECT sd.record_time AS time,
                        s.label AS sensor,
                        sd.temperature,
                        sd.humidity
                FROM SensorData sd
                JOIN Sensors s ON s.sensor_id = sd.sensor_id
                WHERE sd.sensor_id = :sensor_id`,
            {
                replacements: { sensor_id },
            }
        );
        res.json(sensorData)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.get("/avarageValuesFromSensor/:sensorid", async (req, res) => {
    try {
        const sensor_id = req.params.sensorid;
        const sensor = await Sensor.findByPk(sensor_id);

        if (!sensor) {
            return res.status(404).json({ error: "Sensor not found" });
        }

        const { duration } = req.body;
        let timeCondition = "";
        if (duration === "day"){
            timeCondition = `record_time >= DATEADD(DAY, -1, GETDATE())`;
        } else if (duration === "week"){
            timeCondition = `record_time >= DATEADD(WEEK, -1, GETDATE())`;
        } else if (duration === "month"){
            timeCondition = `record_time >= DATEADD(MONTH, -1, GETDATE())`;
        } else {
            return res.status(404).json({ error: "Wrong duration value" });
        }

        let result = {
            sensor_id: sensor_id,
            sensor_name: sensor.label,
            duration: duration,
            avg_temperature: null,
            avg_humidity: null,
        }

        const [avgData] = await sequelize.query(
            `SELECT 
                    AVG(temperature) AS avg_temperature, 
                    AVG(humidity) AS avg_humidity
                FROM SensorData
                WHERE sensor_id = :sensor_id AND ${timeCondition} `,
            {
                replacements: { sensor_id },
            }
        );

        if (avgData.length === 0 || avgData[0].avg_temperature === null) {
            return res.status(404).json({ error: "No data available for the specified period" });
        }

        result.avg_temperature = avgData[0].avg_temperature;
        result.avg_humidity = avgData[0].avg_humidity;

        res.json(result)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

module.exports = router;