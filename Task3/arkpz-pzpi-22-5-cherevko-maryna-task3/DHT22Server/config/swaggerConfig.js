const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DHT22 API",
            version: "1.0.0",
            description: "API для моніторингу умов зберігання швидкопсувних продуктів",
        },
        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Local server",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
