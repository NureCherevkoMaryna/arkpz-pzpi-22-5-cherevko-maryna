const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_SERVER,
        port: parseInt(process.env.DB_PORT, 10),
        dialect: 'mssql',
        logging: console.log,
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        },
    }
);

const connectDB = async () => {
    console.log("Starting database connection...");
    console.log("Connection details:");
    console.log(`DB_SERVER: ${process.env.DB_SERVER}`);
    console.log(`DB_PORT: ${process.env.DB_PORT}`);
    console.log(`DB_DATABASE: ${process.env.DB_DATABASE}`);
    console.log(`DB_USER: ${process.env.DB_USER}`);

    try {
        await sequelize.authenticate();
        console.log("Sequelize connected successfully.");
    } catch (error) {
        console.error("Sequelize connection failed!");
        console.error("Error message:", error.message);
        console.error("Error stack trace:", error.stack);

        if (error.original && error.original.code === 'EHOSTUNREACH') {
            console.error("Host unreachable. Please check your network connection or server address.");
        }
        if (error.original && error.original.code === 'ELOGIN') {
            console.error("Login failed. Please check your username and password.");
        }
        if (error.original && error.original.code === 'ETIMEOUT') {
            console.error("Connection timeout. Please check if the server is running and port is accessible.");
        }
    }
};

module.exports = { sequelize, connectDB };