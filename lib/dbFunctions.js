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
                'View employees by department',
                'Delete departments, roles, or employees',
                'View employees by manager',
                'Update employee manager',
                'View total utilized budget of a department',
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
            case 'View total utilized budget of a department':
                viewTotalBudget();
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

const deleteRestart = () => {
    inquirer
    .prompt(
        {
            type: "list",
            message: "Would you like to go back to the Delete Menu or the Main Menu?",
            name: "deleteChoice",
            choices: [
                'Main Menu',
                'Delete Menu',
                'Exit'
            ]
        }
    )
    .then((answer)=>{
        if (answer.deleteChoice === 'Main Menu'){
            mainMenu();
        } else if (answer.deleteChoice === 'Delete Menu') {
            deleteSomething()
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
    db.query("SELECT * FROM department", (err, results)=>{
        if (err) throw err;
        const deptChoices = results.map(({id, name})=>({
            value: id, name: `${id} ${name}`
        }));
        viewEmpByDeptPrompt(deptChoices)
    })};
    const viewEmpByDeptPrompt = (deptChoices)=>{
    //inq prompt to get dept ID
    inquirer
    .prompt(
        {
            type: "list",
            message: "Please choose the department for which you'd like to see employees",
            name: "deptId",
            choices: deptChoices
        }
    )
    //sql query to view employees by that department (join)
    .then((answer)=>{
        db.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id WHERE department.id = ?", answer.deptId, (err, results)=>{
                if(err) throw err;
                console.log(`Viewing employees in Dept ID#${answer.deptId}`);
                console.table(results);
                restart();
            }
        )
    })
};
//**BONUS FEATURES */
const viewEmpByMgr = () =>{
    db.query("SELECT * FROM employee", (err, results)=>{
        if (err) throw err;
        const empChoices = results.map(({id, first_name, last_name})=>({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));
        viewByMgrPrompt(empChoices);
    })};
    const viewByMgrPrompt = (empChoices)=>{
    inquirer
    .prompt(
        {
            type: "list",
            message: "Please choose the manager for which you'd like to see employees",
            name: "managerId",
            choices: empChoices
        }
    )
    //sql query to view employees by that mgr (join)
    .then((answer)=>{
        db.query(
            "SELECT * FROM employee WHERE employee.manager_id = ?", answer.managerId, (err, results)=>{
                if(err) throw err;
                if(results==0){
                    console.log(`There are no employees under Manager ID#${answer.managerId}`);
                    viewEmpByMgr();
                } else {
                console.log(`Viewing employees under Manager ID#${answer.managerId}`);
                console.table(results);
                restart();
                }}
        )
    })
};

//**BONUS FEATURES */
const viewTotalBudget = ()=>{
    db.query("SELECT * FROM department", (err, results)=>{
        if (err) throw err;
        const deptChoices = results.map(({id, name})=>({
            value: id, name: `${id} ${name}`
        }));
        totalBudgetPrompt(deptChoices)
    })};
    const totalBudgetPrompt = (deptChoices) =>{
        inquirer
        .prompt(
            {
                type: "list",
                message: "Please select the department you'd like to see the total budget for",
                name: "deptId",
                choices: deptChoices
            }
        )
        .then((answers)=>{
            db.query('SELECT SUM(salary) AS total_budget FROM role WHERE role.department_id = ?;', answers.deptId, (err,results)=>{
                if (err) throw err;
                console.table(results);
                restart();
    })
})
}

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
    db.query("SELECT * FROM department", (err, results)=>{
        if (err) throw err;
        const deptChoices = results.map(({id, name})=>({
            value: id, name: `${id} ${name}`
        }));
        addRolePrompt(deptChoices)
    })};
    const addRolePrompt = (deptChoices)=>{
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
            type: "list",
            message: "Please choose the department for this role",
            name: "deptId",
            choices: deptChoices
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
    db.query("SELECT * FROM employee", (err, results)=>{
        if (err) throw err;
        const empChoices = results.map(({id, first_name, last_name})=>({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));
        roleChoicesQuery(empChoices);
    });
    const roleChoicesQuery = (empChoices)=>{
        db.query("SELECT * FROM role", (err, results)=>{
        if (err) throw err;
        const roleChoices = results.map(({id, title})=>({
            value: id, name: `${id} ${title}`
        }));
        addEmpPrompt(empChoices, roleChoices);
    })}};
    const addEmpPrompt = (empChoices, roleChoices)=>{
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
            type: "list",
            message: "Please choose a role for the new employee",
            name: "roleId",
            choices: roleChoices
        },
        {
            type: "confirm",
            message: "Does the new employee have a manager?",
            name: "manager"
        },
        {
            when: (answers)=>answers.manager === true,
            type: "list",
            message: "Please select the manager for the new employee",
            name: "managerId",
            choices: empChoices
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
    db.query("SELECT * FROM employee", (err, results)=>{
        if (err) throw err;
        const updateEmpChoices = results.map(({id, first_name, last_name})=>({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));
        roleChoices(updateEmpChoices);
    })};
    const roleChoices = (updateEmpChoices) =>{
        db.query("SELECT * FROM role", (err, results)=>{
            if (err) throw err;
            const roleChoices = results.map(({id, title})=>({
                value: id, name: `${id} ${title}`
            }));
            updateEmpPrompt(updateEmpChoices, roleChoices)
        })};
    const updateEmpPrompt = (updateEmpChoices, roleChoices)=>{
    //inq prompt to gather info
    inquirer
    .prompt([
        {
            type: "list",
            message: "Please choose an employee",
            name: "empIdUpdate",
            choices: updateEmpChoices
        },
        {
            type: "list",
            message: "Please choose a role for the new employee",
            name: "updatedRoleId",
            choices: roleChoices
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
    db.query("SELECT * FROM employee", (err, results)=>{
        if (err) throw err;
        const empChoices = results.map(({id, first_name, last_name})=>({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));
        updateEmpMgrPrompt(empChoices);
    })};
    const updateEmpMgrPrompt = (empChoices) => {
    inquirer
    .prompt([
        {
            type: "list",
            message: "Please choose the employee",
            name: "empIdUpdate",
            choices: empChoices
        },
        {
            type: "list",
            message: "Please choose the new manager for this employee",
            name: "updatedMgrId",
            choices: empChoices
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
    db.query("SELECT * FROM department", (err, results)=>{
        if (err) throw err;
        const deptChoices = results.map(({id, name})=>({
            value: id, name: `${id} ${name}`
        }));
        delDeptPrompt(deptChoices)
    })};
    const delDeptPrompt = (deptChoices)=>{
    //inquirer prompt for dept id
    inquirer
    .prompt(
        {
            type: "list",
            message: "Please choose the department you'd like to remove",
            name: "removeDept",
            choices: deptChoices
        }
    )
    //sql query to delete that dept
    .then((answer)=>{
        db.query(
            "DELETE FROM department WHERE id = ?", answer.removeDept, (err)=>{
                if (err) {
                    console.log("Cannot remove department; Please remove any employees assigned this department first");
                    deleteRestart();
                } else {
                console.log(`Department (ID#${answer.removeDept}) succesfully removed from database`);
                viewDepartments();
            }
        }
    )})
};

const deleteRole = ()=>{
    db.query("SELECT * FROM role", (err, results)=>{
        if (err) throw err;
        const roleChoices = results.map(({id, title})=>({
            value: id, name: `${id} ${title}`
        }));
        delRolePrompt(roleChoices)
    })};
    const delRolePrompt = (roleChoices)=>{
    //inquirer prompt for role id
    inquirer
    .prompt(
        {
            type: "list",
            message: "Please choose the role you'd like to remove",
            name: "removeRole",
            choices: roleChoices
        }
    )
    //sql query to delete that role
    .then((answer)=>{
        db.query(
            "DELETE FROM role WHERE id = ?", answer.removeRole, (err)=>{
                if (err) {
                    console.log("Cannot remove role; Please remove any employees assigned this role first");
                    deleteRestart();
                } else {
                console.log(`Role (ID#${answer.removeRole}) succesfully removed from database`);
                viewRoles();
                }
            }
        )
    })
};

const deleteEmployee = ()=>{
    db.query("SELECT * FROM employee", (err, results)=>{
        if (err) throw err;
        const delEmpChoices = results.map(({id, first_name, last_name})=>({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));
        delEmployeePrompt(delEmpChoices);
    })};
    const delEmployeePrompt = (delEmpChoices)=>{
    //inquirer prompt for emp id
    inquirer
    .prompt(
        {
            type: "list",
            message: "Please enter the employee ID you'd like to remove",
            name: "removeEmp",
            choices: delEmpChoices
        }
    )
    //sql query to delete that emp
    .then((answer)=>{
        db.query(
            "DELETE FROM employee WHERE id = ?", answer.removeEmp, (err)=>{
                if (err) {
                    console.log(`Employee ID#(${answer.removeEmp}) cannot be removed because they are another employee's manager`);
                    deleteRestart();
                } else {
                console.log(`Employee (ID#${answer.removeEmp}) succesfully removed from database`);
                viewEmployees();
                }}
        )
    })
};

module.exports = mainMenu;