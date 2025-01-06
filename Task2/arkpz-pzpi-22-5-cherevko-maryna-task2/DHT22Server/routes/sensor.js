const express = require("express");
const router = express.Router();
const Func = require("../functions/sensorFunc");
const {sequelize} = require("../config/database");
const Sensor = require("../models/Sensor");

router.get("/getAllSensors", async (req, res) => {
    try {
        const sensors = Func.getAllSensors();
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
            return res.status(404).json({ error: "User not found" });
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

module.exports = router;