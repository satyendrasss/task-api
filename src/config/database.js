const mysql2 = require('mysql2');
require("dotenv").config();
const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DB_DIALECT === "sqlite") {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: process.env.DB_STORAGE
    });

} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT,
            dialectModule: mysql2,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: true
                }
            }
        }
    );
}

module.exports = sequelize;
