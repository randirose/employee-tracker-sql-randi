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

INSERT INTO employee (first_name,last_name,role_id)
VALUES
('John', 'Smith', 1),
('Lucy', 'Brown', 2),
('Sara', 'Johnson', 3),
('Tad', 'Gonzales', 4);