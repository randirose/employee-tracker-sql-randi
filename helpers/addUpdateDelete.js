const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('../db/connection.js');
const cTable = require('console.table');
const mainMenu = require('./mainMenu.js');
const { viewDepartments, viewRoles, viewEmployees } = require('./viewAll.js');

const addDepartment = () =>{
    //inquirer prompt to ask which department
    inquirer
    .prompt(
        {
            type: "input",
            message: "What is the new department's name?",
            name: "departmentName"
        }
    )
    .then((answer)=>{
        //sql query to add department to department table
        db.query(
            "INSERT INTO department (name) VALUES (?)", answer.departmentName, (err)=>{
                if (err) throw err;
                console.log(`${answer.departmentName} added successfully`)
                viewDepartments();
            }
            
        )
    });

};

const addRole = () =>{
    //inquirer prompt to ask abt role
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please input the name of the new role",
            name: "newRole"
        },
        {
            type: "input",
            message: "Please input the salary for this role",
            name: "newSalary"
        },
        {
            type: "input",
            message: "Please input the department ID for this role",
            name: "deptId"
        }
    ])
    //sql query to add role info
    .then((answers)=>{
        db.query(
            "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)", [answers.newRole,answers.newSalary,answers.deptId], (err)=>{
                if (err) throw err;
                console.log(`${answers.newRole} added successfully`);
                viewRoles();
            }
        )
    })
};

const addEmployee = () =>{
    //inquirer prompt to ask abt employee
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please input the first name of the new employee",
            name: "firstName"
        },
        {
            type: "input",
            message: "Please input the last name of the new employee",
            name: "lastName"
        },
        {
            type: "input",
            message: "Please input the role ID of the new employee",
            name: "roleId"
        },
        {
            type: "confirm",
            message: "Does the new employee have a manager?",
            name: "manager"
        },
        {
            when: (answers)=>answers.manager === true,
            type: "input",
            message: "Please input the manager ID for the new employee",
            name: "managerId"
        },
    ])
    //sql query to add employee info
    .then((answers)=>{
        db.query(
            "INSERT INTO employee (first_name,last_name,role_id,manager_id VALUES (?,?,?,?)", [answers.firstName,answers.lastName,answers.roleId,answers.managerId], (err)=>{
                if(err) throw err;
                console.log(`New employee ${answers.firstName} ${answers.lastName} added succesfully`);
                viewEmployees();
            }
        )
    })
};

const updateEmployeeRole = () => {
    //inq prompt to gather info
    //sql query to update role
}

module.exports = { addDepartment, addRole, addEmployee, updateEmployeeRole };