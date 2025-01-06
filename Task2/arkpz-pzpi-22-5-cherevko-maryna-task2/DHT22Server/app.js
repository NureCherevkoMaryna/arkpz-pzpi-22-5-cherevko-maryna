const express = require('express');
const {connectDB} = require("./config/database");
const path = require("path");

require('dotenv').config();

const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./config/swaggerConfig");
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./config/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);

// маршрути
app.use('/api/users', require('./routes/user'));
app.use('/api/alerts', require('./routes/alert'));
app.use('/api/sensors', require('./routes/sensor'));
app.use('/api/sensordata', require('./routes/sensorData'));
app.use('/api/notifications', require('./routes/notificationSettings'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
})

