use final_project_elliot;
CREATE TABLE ai_priorities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goal_name VARCHAR(255),
    percentage INT
);

INSERT INTO ai_priorities (goal_name, percentage) VALUES 
('Caregiver Satisfication', 72),
('Patient Safety', 58),
('Workflow Efficiency', 53),
('Financial', 12),
('Patient Experience', 5),
('Market Competitiveness', 0);

CREATE TABLE printing_market_size (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year INT,
    market_size_billion DECIMAL(10, 2)
);

-- Insert the data from the Precedence Research chart
INSERT INTO printing_market_size (year, market_size_billion) VALUES 
(2025, 1.96),
(2026, 2.32),
(2027, 2.73),
(2028, 3.23),
(2029, 3.81),
(2030, 4.49),
(2031, 5.30),
(2032, 6.25),
(2033, 7.38),
(2034, 8.71);