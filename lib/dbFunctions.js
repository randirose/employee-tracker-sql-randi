const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('../db/connection');
const cTable = require('console.table');

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
                'View employees by manager', //need to add
                'Update employee manager',
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
            case 'View employees by manager':
                viewEmpByMgr();
                break;
            case 'Update employee manager':
                updateEmpMgr();
                break;
            case 'Exit':
                db.end();
                break;
        }
    }
)};

const restart = () => {
    inquirer
    .prompt(
        {
            type: "confirm",
            message: "Would you like to go back to the main menu?",
            name: "back"
        }
    )
    .then((answer)=>{
        if (answer.back === true){
            mainMenu();
        } else {
            db.end();
        }
    })

    
};

const viewDepartments=()=>{
    db.query('SELECT * FROM department;', (err,results)=>{
        if (err) throw err;
        console.table(results);
        restart();
    });
    
};

const viewRoles=()=>{
    db.query('SELECT * FROM role;', (err,results)=>{
        if (err) throw err;
        console.table(results);
        restart();
    })
};
const viewEmployees=()=>{
    db.query('SELECT * FROM employee;', (err,results)=>{
        if (err) throw err;
        console.table(results);
        restart();
    })
};

//**BONUS FEATURES */
const viewEmpByDepartment=()=>{
    //inq prompt to get dept ID
    inquirer
    .prompt(
        {
            type: "input",
            message: "Please enter the Department ID for which you'd like to see employees",
            name: "deptId"
        }
    )
    //sql query to view employees by that department (join)
    .then((answer)=>{
        db.query(
            "SELECT ?, employee.first_name FROM employee LEFT JOIN role.id ON employee.role_id LEFT JOIN department ON department.id = role.department_id GROUP BY department.id", answer.deptId, (err, results)=>{
                if(err) throw err;
                console.log(`Viewing employees in Dept ID#${answer.deptId}`);
                console.table(results);
            }
        )
    })
};
//**BONUS FEATURES */
const viewEmpByMgr = () =>{
    inquirer
    .prompt(
        {
            type: "input",
            message: "Please enter the Manager ID for which you'd like to see employees",
            name: "managerId"
        }
    )
    //sql query to view employees by that mgr (join)
    .then((answer)=>{
        db.query(
            "SELECT manager_id, employee.first_name, employee.last_name FROM employee", answer.managerId, (err, results)=>{
                if(err) throw err;
                console.log(`Viewing employees under Manager ID#${answer.managerId}`);
                console.table(results);
            }
        )
    })
};

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
                if (err) {
                    console.log(err);
                  }
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
                if (err) {
                    console.log(err);
                  }
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
            "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)", [answers.firstName,answers.lastName,answers.roleId,answers.managerId], (err)=>{
                if (err) {
                    console.log(err);
                  }
                console.log(`New employee ${answers.firstName} ${answers.lastName} added succesfully`);
                viewEmployees();
            }
        )}
    )};

const updateEmployeeRole = () => {
    //inq prompt to gather info
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please enter the employee ID",
            name: "empIdUpdate"
        },
        {
            type: "input",
            message: "Please enter the new role ID for this employee",
            name: "updatedRoleId"
        }

    ])
    //sql query to update role
    .then((answers)=>{
        db.query(
            "UPDATE employee SET role_id=? WHERE id=?", [answers.updatedRoleId, answers.empIdUpdate], (err)=>{
                if (err){
                    console.log(err);
                }
                console.log(`Employee (ID#${answers.empIdUpdate}) role successfully updated`)
                viewEmployees();
            }
        )
    })

};

//**BONUS FEATURES */
const updateEmpMgr = ()=>{
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please enter the employee ID",
            name: "empIdUpdate"
        },
        {
            type: "input",
            message: "Please enter the new manager ID for this employee",
            name: "updatedMgrId"
        }

    ])
    //sql query to update role
    .then((answers)=>{
        db.query(
            "UPDATE employee SET manager_id=? WHERE id=?", [answers.updatedMgrId, answers.empIdUpdate], (err)=>{
                if (err){
                    console.log(err);
                }
                console.log(`Employee (ID#${answers.empIdUpdate}) manager successfully updated`)
                viewEmployees();
            }
        )
    })

};

//**BONUS FEATURES */
const deleteSomething = ()=>{
    //inquirer prompt to see if they want to delete dept, role, or employee
    inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to remove from the database?",
            name: "deleteChoice",
            choices:[
                'Remove department',
                'Remove role',
                'Remove employee'
            ]
        }
    ])
    //.then, switch case for which option they chose
    .then((answers)=>{
        console.log(`You have chosen to ${answers.deleteChoice}`);

        switch (answers.deleteChoice){
            case 'Remove department':
                deleteDepartment();
                break;
            case 'Remove role':
                deleteRole();
                break;
            case 'Remove employee':
                deleteEmployee();
                break;
        }
    })
    //calls function based on what option they chose
};

const deleteDepartment = ()=>{
    //inquirer prompt for dept id
    inquirer
    .prompt(
        {
            type: "input",
            message: "Please enter the department ID you'd like to remove",
            name: "removeDept"
        }
    )
    //sql query to delete that dept
    .then((answer)=>{
        db.query(
            "DELETE FROM department WHERE id = ?", answer.removeDept, (err)=>{
                if (err) {
                    console.log("Cannot remove department; Please remove any employees/roles assigned this role first");
                    deleteSomething();
                } else {
                console.log(`Department (ID#${answer.removeDept}) succesfully removed from database`);
                viewDepartments();
            }
        }
    )})
};

const deleteRole = ()=>{
    //inquirer prompt for role id
    inquirer
    .prompt(
        {
            type: "input",
            message: "Please enter the role ID you'd like to remove",
            name: "removeRole"
        }
    )
    //sql query to delete that role
    .then((answer)=>{
        db.query(
            "DELETE FROM role WHERE id = ?", answer.removeRole, (err)=>{
                if (err) {
                    console.log("Cannot remove role; Please remove any employees assigned this role first");
                    deleteSomething();
                } else {
                console.log(`Role (ID#${answer.removeRole}) succesfully removed from database`);
                viewRoles();
                }
            }
        )
    })
};

const deleteEmployee = ()=>{
    //inquirer prompt for emp id
    inquirer
    .prompt(
        {
            type: "input",
            message: "Please enter the employee ID you'd like to remove",
            name: "removeEmp"
        }
    )
    //sql query to delete that emp
    .then((answer)=>{
        db.query(
            "DELETE FROM employee WHERE id = ?", answer.removeEmp, (err)=>{
                if (err) throw err;
                console.log(`Employee (ID#${answer.removeEmp}) succesfully removed from database`);
                viewEmployees();
            }
        )
    })
};

module.exports = mainMenu;