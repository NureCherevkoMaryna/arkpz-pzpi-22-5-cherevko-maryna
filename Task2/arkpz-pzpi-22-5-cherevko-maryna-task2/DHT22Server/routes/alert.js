const express = require("express");
const router = express.Router();
const Func = require("../functions/alertFunc");
const {sequelize} = require("../config/database");
const Alert = require("../models/Alert");
const Sensor = require("../models/Sensor");
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
        const { alert_type, message, user_id, notification_id } = req.body;
        if (!alert_type || !message || !notification_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const notification = await NotificationSettings.findByPk(notification_id);
        if (!notification) {
            return res.status(400).json({ error: "Notification not found" });
        }

        const sensor = await Sensor.findByPk(notification.sensor_id);

        let alert_message = `${message}\nПоточна темрепатура:${sensor.temperature}\nПоточна вологість:${sensor.humidity}`
        let resolved = false;

        const newNotification = await Alert.create({ alert_type, alert_message, user_id, notification_id, resolved });

        res.status(201).json({ message: "Notification created successfully", notification: newNotification });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

module.exports = router;