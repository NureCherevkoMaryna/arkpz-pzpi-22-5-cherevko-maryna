const Alert = require("../models/Alert");

async function getAllAlerts() {
    return await Alert.findAll();
}

module.exports = {
    getAllAlerts
};