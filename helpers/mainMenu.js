const inquirer = require('inquirer');
const { viewDepartments, viewRoles, viewEmployees, viewEmpByDepartment } = require('./viewAll.js');
const { addDepartment, addRole, addEmployee, updateEmployeeRole, deleteSomething } = require('./addUpdateDelete.js');

const mainMenu = ()=>{
    inquirer
    .prompt(
        {
            type: "list",
            message: 'Please select an option below',
            name: "userChoice",
            choices: [
                'View all departments', 
                'View all roles', 
                'View all employees', 
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employee role',
                'View employees by department', //need to add
                'Delete departments, roles, or employees', //need to add
                'Exit'
            ]
        }

    )
    .then((answers)=>{
        //error handling
        //log what user chose
        console.log(`You chose "${answers.userChoice}"`);
        //switch/case for whatever the user chooses, calls whatver function applies to what they chose
        switch (answers.userChoice){
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'View employees by department':
                viewEmpByDepartment();
                break;
            case 'Delete departments, roles, or employees':
                deleteSomething();
                break;
            case 'Exit':
                db.end();
                break;
        }
    }
)};

module.exports = mainMenu;