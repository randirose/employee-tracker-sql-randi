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
});

//sql query to run schema and seeds to set up db
db.query('SOURCE db/schema.sql;', (err, results)=>{
    if(err){
        res.json({message: "error running schema.sql",error:true});
    }
    res.json(results);
    db.query('SOURCE db/seeds.sql;', (err, results)=>{
        if(err){
            res.json({message: "error running seeds.sql", error:true})
        }
        res.json(results);
        mainMenu();
    })
});