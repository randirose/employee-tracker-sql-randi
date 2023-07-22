const mysql = require('mysql2');

//mysql db connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "employees_db",
    socketPath: "/tmp/mysql.sock"
});

module.exports = db;