const User = require("../models/User");
const Func = require("../functions/coreFunc");

async function getAllUsers() {
    return await User.findAll();
}

async function getUserById(id) {
    return await User.findByPk(id);
}

async function addUser(username, password, email) {
    let password_hash = Func.fnv1aHash(password);
    return await User.create({ username, password_hash, email });
}

async function isUserCorrect(username, password, email) {
    let password_hash = Func.fnv1aHash(password);

    return await User.create({ username, password_hash, email });
}

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    isUserCorrect
};