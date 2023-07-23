// import libraries
const mysql = require('mysql2');
const mainMenu = require('./lib/dbFunctions.js');
const db = require('./db/connection.js');


db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to employees_db database!");
    mainMenu();
  });
