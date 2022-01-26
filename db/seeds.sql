INSERT INTO department (name)
VALUES
('TSS'),
('Finance'),
('HR'),
('Flight Planning'),
('Weather'),
('IT'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Mission Advisor', 50000, 1),
('Ecomonist', 98000, 2),
('Talent Scout', 70000, 3)
('Flight Planner', 63000. 4),
('Meteorologist', 61000, 5),
('Network Technician', 115000, 6)
('Lead Salesman', 110000, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Tom', 'Jones', 4, 2),
('Bo', 'Jackson', 1, 4),
('Tammy', 'Scott', 7, NULL),
('Sherry', 'Peterson', 3, 1),
('Jimmy', 'Scott', 5, 2),
('Phllip', "Johnson", 6, NULL),
('Phil', 'Bailey', 2, 3);