 const dotenv = require("dotenv");
 dotenv.config()

const { Sequelize } = require('sequelize');

// Load environment variables from .env file
dotenv.config();

function loadDbConfig() {
 return {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: 'mysql'
  }
}

const config = loadDbConfig()
console.log(config)
// Create Sequelize instance with the environment variables

const sequelize = new Sequelize(config);
  
module.exports = sequelize;
