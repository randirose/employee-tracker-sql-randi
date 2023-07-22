const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('../server.js');

const viewDepartments=()=>{
    db.query('SELECT * FROM department;', (err,results)=>{
        if (err) throw err;
        console.log(results);
    })
};
const viewRoles=()=>{
    //sql query to show departments table
};
const viewEmployees=()=>{
    //sql query to show departments table
};

module.exports = { viewDepartments, viewRoles, viewEmployees };