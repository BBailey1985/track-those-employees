const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

//connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "office_staff",
});

//throw error if connection is incorrect
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the office staff database \n");
  promptUser();
});

//initial prompt for user
const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((answers) => {
      let option = answers.option;
      switch (option) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateRole();
          break;
      }
    });
};

//view all departments
viewDepartments = () => {
  console.log("Viewing all departments \n");
  const sql = `SELECT department.id AS Id, department.name AS department FROM department;`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//view all roles
viewRoles = () => {
  console.log("Viewing all roles \n");
  const sql = `SELECT role.id, role.title, role.salary, department.name as department FROM
  role LEFT JOIN department ON role.department_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//view all employees
viewEmployees = () => {
  console.log("Viewing all Employees \n");
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department,
  role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM
  employee LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//add department
addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "What is the name of the department to add?",
        validate: (newInput) => {
          if (newInput) {
            return true;
          } else {
            console.log("Invalid Entry, Please try again!");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;

      db.query(sql, answer.newDepartment, (err, res) => {
        if (err) throw err;
        console.log(
          "The " + answer.newDepartment + " department has been added"
        );
        viewDepartments();
      });
    });
};

//add a role
addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRole",
        message: "What is the title of the role to add?",
        validate: (newInput) => {
          if (newInput) {
            return true;
          } else {
            console.log("Invalid Entry, Please try again!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "newSalary",
        message: "What is the role's salary?",
        validate: (newInput) => {
          if (newInput) {
            return true;
          } else {
            console.log("Invalid Entry, Please try again!");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.newRole, answer.newSalary];
      const roleSql = `SELECT name, id FROM department`;

      db.query(roleSql, (err, data) => {
        if (err) throw err;
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "Which department is this role in?",
              choices: dept,
            },
          ])
          .then((choice) => {
            const dept = choice.dept;
            params.push(dept);

            const sql =
              "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";

            db.query(sql, params, (err, res) => {
              if (err) throw err;
              console.log(
                "The " + answer.newDepartment + " role has been added"
              );
              viewRoles();
            });
          });
      });
    });
};

// add an employee
addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate: (newInput) => {
          if (newInput) {
            return true;
          } else {
            console.log("Invalid Entry, Please try again!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (newInput) => {
          if (newInput) {
            return true;
          } else {
            console.log("Invalid Entry, Please try again!");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.firstName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;

      db.query(roleSql, (err, data) => {
        if (err) throw err;
        const roles = data.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            params.push(role);

            const managerSql = `SELECT * FROM employee`;

            db.query(managerSql, (err, data) => {
              if (err) throw err;
              const manager = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: manager,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  params.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("The employee has been added to the database!");
                    viewEmployees();
                  });
                });
            });
          });
      });
    });
};

//update employee role
updateRole = () => {
  const employeeSql = `SELECT * FROM employee`;

  db.query(employeeSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name}) => ({ name: first_name + ' ' + last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Which employee would you like to update?',
        choices: employees
      }
    ])
    .then (empChoice => {
      const employee = empChoice.name;
      const params = [];
      params.push(employee);

      const roleSql = `SELECT * FROM role`;

      db.query(roleSql, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: "What is the employee's new role?",
            choices: roles
          }
        ])
        .then (roleChoice => {
          const role = roleChoice.role;
          params.push(role);

          let employee = params[0]
          params[0] = role
          params[1] = employee

          const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

          db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log("Employee has been updated!");

            viewEmployees();
          });
        });
      });
    });
  });
};