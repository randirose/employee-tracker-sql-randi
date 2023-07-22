// import libraries
const mysql = require('mysql2');
const mainMenu = require('./helpers/mainMenu.js');


//mysql db connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "employees_db",
    socketPath: "/tmp/mysql.sock"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to employees_db database!");
    mainMenu();
  });


module.exports = db;