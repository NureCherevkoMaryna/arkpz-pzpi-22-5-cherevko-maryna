const express = require("express");
const router = express.Router();
const {sequelize} = require("../config/database");
const Sensor = require("../models/Sensor");
const NotificationSettings = require("../models/NotificationSettings");

router.get("/getAllNotifications", async (req, res) => {
    try {
        const notifications = await NotificationSettings.findAll();
        res.json(notifications)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.get("/getNotificationById/:notificationid", async (req, res) => {
    try {
        const notification_id = req.params.notificationid;
        const notification = await NotificationSettings.findByPk(notification_id);

        if (!notification) {
            return res.status(404).json({error: "Notification not found"});
        }
        res.json(notification)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.get('/getNotificationBySensorId/:sensorId', async (req, res) => {
    try {
        const sensorId = req.params.sensorId;

        const notificationSettings = await NotificationSettings.findOne({
            where: {
                sensor_id: sensorId,
            },
        });

        if (notificationSettings) {
            res.status(200).json(notificationSettings);
        } else {
            res.status(404).json({ message: 'Notification settings not found for this sensor ID.' });
        }
    } catch (error) {
        console.error('Error fetching notification settings:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

router.post("/addNotificationSettings", async (req, res) => {
    try {
        const { temperature_min, temperature_max, humidity_min, humidity_max, sensor_id } = req.body;

        if (!sensor_id) {
            return res.status(400).json({ error: "Sensor is required" });
        }

        const sensor = await Sensor.findByPk(sensor_id);
        if (!sensor) {
            return res.status(400).json({ error: "Sensor not found" });
        }

        const newNotificationSettings = await NotificationSettings.create({ temperature_min, temperature_max, humidity_min, humidity_max, sensor_id });

        res.status(201).json({ message: "Notification created successfully", notification: newNotificationSettings });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

module.exports = router;