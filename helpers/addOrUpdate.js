const inquirer = require('inquirer');
const mysql = require('mysql2');

const addDepartment = () =>{
    //inquirer prompt to ask which department
    //sql query to add department to department table
};

const addRole = () =>{
    //inquirer prompt to ask abt role
    //sql query to add role info
};

const addEmployee = () =>{
    //inquirer prompt to ask abt employee
    //sql query to add employee info
};

const updateEmployeeRole = () => {
    //inq prompt to gather info
    //sql query to update role
}

module.exports = { addDepartment, addRole, addEmployee, updateEmployeeRole };