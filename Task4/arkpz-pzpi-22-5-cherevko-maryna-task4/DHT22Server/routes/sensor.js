const express = require("express");
const router = express.Router();
const {sequelize} = require("../config/database");
const Sensor = require("../models/Sensor");
const SensorData = require("../models/SensorData");
const User = require("../models/User");
const UserSensor = require("../models/UserSensor");

router.get("/getAllSensors", async (req, res) => {
    try {
        const sensors = await Sensor.findAll();
        res.json(sensors)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.get("/getSensorById/:sensorid", async (req, res) => {
    try {
        const sensor_id = req.params.sensorid;
        const sensor = await Sensor.findByPk(sensor_id);

        if (!sensor) {
            return res.status(404).json({error: "Sensor not found"});
        }
        res.json(sensor)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.post("/addSensor", async (req, res) => {
    try {
        const { label, device_type } = req.body;

        if (!label || !device_type) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newSensor = await Sensor.create({ label, device_type });

        res.status(201).json({ message: "Sensor created successfully", sensor: newSensor });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.put("/updateSensorParameters/:sensorid", async (req, res) => {
    try {
        const sensor_id = req.params.sensorid;
        const { label, device_type } = req.body;

        const sensor = await Sensor.findByPk(sensor_id);
        if (!sensor) {
            return res.status(404).json({ error: "Sensor not found" });
        }

        if (label !== undefined){
            await sensor.update({
                label: label || sensor.label,
            });
        }
        if (device_type !== undefined){
            await sensor.update({
                device_type: device_type || sensor.device_type,
            });
        }

        res.status(200).json({ message: "Sensor updated successfully", sensor: sensor });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.put("/updateSensorValues/:sensorid", async (req, res) => {
    try {
        const sensor_id = req.params.sensorid;
        const { temperature, humidity } = req.body;

        const sensor = await Sensor.findByPk(sensor_id);
        if (!sensor) {
            return res.status(404).json({ error: "Sensor not found" });
        }

        const sensorData = await SensorData.create({
            sensor_id: sensor_id,
            record_time: new Date(),
            temperature: sensor.temperature,
            humidity: sensor.humidity
        });

        await sensor.update({
            temperature: temperature || sensor.temperature,
            humidity: humidity || sensor.humidity,
        });

        res.status(200).json({ message: "Sensor values updated successfully", sensor_data: sensorData, sensor: sensor });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.post("/addSensorToUser", async (req, res) => {
    try {
        const { user_id, sensor_id } = req.body;
        if (!user_id || !sensor_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const sensor = await Sensor.findByPk(sensor_id);
        if (!sensor) {
            return res.status(404).json({ error: "Sensor not found" });
        }

        // const newUserSensor = await UserSensor.create({ user_id, sensor_id });
        const [newUserSensor] = await sequelize.query(
            `
            INSERT INTO UserSensor (user_id, sensor_id)
            OUTPUT INSERTED.*
            VALUES (:user_id, :sensor_id)
            `,
            {
                replacements: {
                    user_id,
                    sensor_id,
                },
            }
        );

        res.status(201).json({ message: "Sensor created successfully", userSensor: newUserSensor });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.delete("/delSensorById/:sensorid", async (req, res) => {
    try {
        const sensor_id = req.params.sensorid;
        const sensor = await Sensor.findByPk(sensor_id);
        if (!sensor) {
            return res.status(404).json({ error: "Sensor not found" });
        }

        await sensor.destroy();

        res.status(200).json({ message: `Sensor with ID ${user_id} deleted successfully` });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

module.exports = router;