const express = require("express");
const router = express.Router();
const {sequelize} = require("../config/database");
const Alert = require("../models/Alert");
const Sensor = require("../models/Sensor");
const User = require("../models/User");
const NotificationSettings = require("../models/NotificationSettings");

router.get("/getAllAlerts", async (req, res) => {
    try {
        const alerts = await Alert.findAll();
        res.json(alerts)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.get("/getAlertsByUserId/:userid", async (req, res) => {
    try {
        const user_id = req.params.userid;

        const [alerts] = await sequelize.query(
            `SELECT * FROM Alerts WHERE user_id = :user_id`,
            {
                replacements: { user_id },
            }
        );

        if (!alerts) {
            return res.status(404).json({error: "User not found"});
        }
        res.json(alerts)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.get("/getAlertById/:alertid", async (req, res) => {
    try {
        const alert_id = req.params.alertid;
        const alert = await Alert.findByPk(alert_id);

        if (!alert) {
            return res.status(404).json({error: "Alert not found"});
        }
        res.json(alert)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.post("/addAlert", async (req, res) => {
    try {
        const { user_id, notification_id } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const notification = await NotificationSettings.findByPk(notification_id);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        const sensor_id = notification.sensor_id;
        const sensor = await Sensor.findByPk(sensor_id);
        const temperature = sensor.temperature;
        const humidity = sensor.humidity;

        let tempAlertMessage = null;
        let tempAlertType = "Temperature Alert";
        let humAlertMessage = null;
        let humAlertType = "Humidity Alert";
        let resolved = false;
        let temperatureAlert = { message: "Sensor value is normal", alert: null };
        let humidityAlert = { message: "Sensor value is normal", alert: null };

        const temp_min = notification.temperature_min;
        const temp_max = notification.temperature_max;
        const hum_min = notification.humidity_min;
        const hum_max = notification.humidity_max;

        if ((temp_min && temperature < temp_min) || (temp_max && temperature > temp_max)) {
            tempAlertMessage = `Temperature out of range: ${temperature}°C (Min: ${notification.temperature_min}, Max: ${notification.temperature_max})`;
        }
        if ((hum_min && humidity < hum_min) || (hum_max && humidity > hum_max)) {
            humAlertMessage = `Humidity out of range: ${humidity}% (Min: ${notification.humidity_min}, Max: ${notification.humidity_max})`;
        }

        if (tempAlertMessage) {
            temperatureAlert.message = "Alert created successfully";
            temperatureAlert.alert = await Alert.create({
                alert_type: tempAlertType,
                alert_message: tempAlertMessage,
                user_id,
                notification_id,
                resolved
            });
        }
        if (humAlertType) {
            humidityAlert.message = "Alert created successfully";
            humidityAlert.alert = await Alert.create({
                alert_type: humAlertType,
                alert_message: humAlertMessage,
                user_id,
                notification_id,
                resolved
            });
        }

        res.status(201).json({ temperature_alert: temperatureAlert, humidity_alert: humidityAlert });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

module.exports = router;