const inquirer = require('inquirer');
const { viewDepartments, viewRoles, viewEmployees } = require('viewAll.js');
const { addDepartment, addRole, addEmployee, updateEmployeeRole } = require('addOrUpdate.js');

const mainMenu = ()=>{
    inquirer
    .prompt(
        {
            type: ListPrompt,
            message: 'Please select an option below',
            name: userChoices,
            choices: [
                'View all departments', 
                'View all roles', 
                'View all employees', 
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employee role'
            ]
        }

    )
    .then((answers)=>{
        //error handling
        //log what user chose
        //switch/case for whatever the user chooses, calls whatver function applies to what they chose
    }
)};

module.exports = mainMenu;