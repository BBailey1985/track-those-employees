const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "office_staff",
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to the office staff database \n");
  promptUser();
});

const promptUser = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
    }
  ])
  .then((answers) => {
    let option = answers.option;
    switch (option) {
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add a Department':
        addDepartment();
        break;
      case 'Add a Role':
        addRole();
        break;
      case 'Add an Employee':
        addEmployee();
        break;
      case 'Update an Employee Role':
        updateRole();
        break;
    }
  })
};

viewDepartments = () => {
  console.log('Viewing all departments \n');
  const sql = `SELECT department.id AS Id, department.name AS Department FROM department;`

    db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    })
};

viewRoles = () => {
  console.log('Viewing all roles \n');
  const sql = `SELECT department.id AS Id, department.name AS Department FROM department;`

    db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    })
}