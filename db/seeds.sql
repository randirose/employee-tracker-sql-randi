INSERT INTO department (name)
VALUES
('Human Resources'),
('Management'),
('Communications'),
('IT');

INSERT INTO role (title, salary, department_id)
VALUES
('HR Director', 50000.00, 1),
('CEO', 100000.00, 2),
('Comms Specialist', 40000.00, 3),
('Tech Analyst', 60000.00, 4);

INSERT INTO employee (first_name,last_name,role_id, manager_id)
VALUES
('Lucy', 'Brown', 1, null),
('John', 'Smith', 2, 1),
('Sara', 'Johnson', 3, 2),
('Tad', 'Gonzales', 4, 1),
('Jessie', 'Jordan', 3, 2),
('Kate', 'Moore', 4, 1);