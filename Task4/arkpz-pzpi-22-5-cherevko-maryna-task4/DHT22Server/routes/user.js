const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {sequelize} = require("../config/database");
const Func = require("../functions/coreFunc");

router.get("/getAllUsers", async (req, res) => {
    try {
        const [users] = await sequelize.query(
            `SELECT user_id, username, email FROM Users`
        );
        res.json(users)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.get("/getUserById/:userid", async (req, res) => {
    try {
        const user_id = req.params.userid;
        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        res.json(user)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.post("/addUser", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }

        let password_hash = Func.fnv1aHash(password);
        const newUser = await User.create({ username, password_hash, email });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.put("/updateUser/:userid", async (req, res) => {
    try {
        const user_id = req.params.userid;
        const { username, password, email } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (username !== undefined){
            await user.update({
                username: username || user.username,
            });
        }
        if (password !== undefined){
            let password_hash = Func.fnv1aHash(password);
            await user.update({
                password_hash: password_hash || user.password_hash,
            });
        }
        if (email !== undefined){
            await user.update({
                email: email || user.email,
            });
        }

        res.status(200).json({ message: "User updated successfully", user: user });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.delete("/delUserById/:userid", async (req, res) => {
    try {
        const user_id = req.params.userid;
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();

        res.status(200).json({ message: `User with ID ${user_id} deleted successfully` });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user)
            return res.status(401).json({ error: "User not found" });

        const password_hash = Func.fnv1aHash(password);
        if (password_hash.toString() !== user.password_hash)
            return res.status(401).json({ error: "Wrong password" });

        res.json(user)
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})

module.exports = router;