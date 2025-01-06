const NotificationSettings = require("../models/NotificationSettings");

async function getAllNotifications() {
    return await NotificationSettings.findAll();
}

module.exports = {
    getAllNotifications
};