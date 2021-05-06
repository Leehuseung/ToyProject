const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.server_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.database
});

module.exports = {
    pool: pool
}