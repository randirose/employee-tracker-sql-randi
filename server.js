// import libraries
const inquirer = require('inquirer');
const mysql = require('mysql2');
const mainMenu = require('./helpers/mainMenu');


//mysql db connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql123",
    database: "employees_db",
    socketPath: "/tmp/mysql.sock"
}, ()=>{
    console.log(`connected to ${database} database`);
    mainMenu();
});