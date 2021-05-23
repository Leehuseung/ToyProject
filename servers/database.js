const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config()

const pool = mysql.createPool({
    host: process.env.SERVER_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
});

module.exports = {
    pool: pool,
}