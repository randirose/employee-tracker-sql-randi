const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('../db/connection');
const cTable = require('console.table');
const mainMenu = require('./mainMenu.js');

const viewDepartments=()=>{
    db.query('SELECT * FROM department;', (err,results)=>{
        if (err) throw err;
        console.table(results);
        // mainMenu();
    });
    
};

const viewRoles=()=>{
    db.query('SELECT * FROM role;', (err,results)=>{
        if (err) throw err;
        console.table(results);
        // mainMenu();
    })
};
const viewEmployees=()=>{
    db.query('SELECT * FROM employee;', (err,results)=>{
        if (err) throw err;
        console.table(results);
        // mainMenu();
    })
};
//**BONUS FEATURE */
const viewEmpByDepartment=()=>{
    //sql query to view employees by department
}

module.exports = { viewDepartments, viewRoles, viewEmployees, viewEmpByDepartment };