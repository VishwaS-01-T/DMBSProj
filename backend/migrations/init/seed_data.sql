INSERT INTO Institutions (name, type, accreditation, state) VALUES
('Ganga Institute of Technology', 'STATE', 'NAAC-A', 'Karnataka'),
('Veda University', 'PRIVATE', 'NAAC-A+', 'Maharashtra');

INSERT INTO Providers (name, type, contact_email) VALUES
('National Scholarship Board', 'GOVERNMENT', 'nsb@gov.in'),
('BrightFuture NGO', 'NGO', 'contact@brightfuture.org'),
('Ganga Institute of Technology', 'INSTITUTION', 'admin@git.edu'),
('Veda University', 'INSTITUTION', 'admin@veda.edu');

INSERT INTO Students
(name, dob, gender, caste_category, annual_family_income, cgpa, disability_status, state, institution_id, department, year_of_study, enrollment_no)
VALUES
('Aarav Menon', '2003-06-14', 'MALE', 'GEN', 550000, 8.6, FALSE, 'Karnataka', 1, 'CSE', 2, 'GIT23CSE001'),
('Isha Verma', '2002-02-09', 'FEMALE', 'OBC', 280000, 9.1, FALSE, 'Karnataka', 1, 'CSE', 3, 'GIT22CSE014'),
('Rohit Saha', '2004-11-20', 'MALE', 'SC', 150000, 7.8, FALSE, 'Karnataka', 1, 'ECE', 1, 'GIT24ECE021'),
('Meera Nair', '2003-03-05', 'FEMALE', 'EWS', 320000, 8.9, TRUE, 'Karnataka', 1, 'ME', 2, 'GIT23ME008'),
('Kabir Singh', '2002-08-30', 'MALE', 'GEN', 820000, 8.2, FALSE, 'Maharashtra', 2, 'CSE', 3, 'VED22CSE004'),
('Tanya Bose', '2003-12-02', 'FEMALE', 'ST', 180000, 8.4, FALSE, 'Maharashtra', 2, 'EEE', 2, 'VED23EEE017'),
('Arjun Patel', '2002-07-07', 'MALE', 'OBC', 260000, 9.3, FALSE, 'Maharashtra', 2, 'CSE', 3, 'VED22CSE011'),
('Neha Kulkarni', '2004-01-18', 'FEMALE', 'GEN', 600000, 7.6, FALSE, 'Karnataka', 1, 'CSE', 1, 'GIT24CSE032'),
('Dev Shah', '2003-05-22', 'MALE', 'EWS', 230000, 8.1, FALSE, 'Karnataka', 1, 'ECE', 2, 'GIT23ECE019'),
('Sana Qureshi', '2002-10-10', 'FEMALE', 'GEN', 720000, 8.8, FALSE, 'Maharashtra', 2, 'ME', 3, 'VED22ME006');

INSERT INTO Scholarships
(name, scholarship_type, provider_id, institution_id, amount_inr, seats_available, deadline, min_cgpa, max_family_income, gender_req, category_req, disability_req, state_req, renewable)
VALUES
('National Merit Support', 'EXTERNAL', 1, NULL, 50000, 120, '2026-08-31', 8.0, 600000, NULL, NULL, FALSE, NULL, TRUE),
('State STEM Scholars', 'EXTERNAL', 1, NULL, 40000, 80, '2026-07-15', 7.5, 450000, NULL, 'OBC', FALSE, 'Karnataka', FALSE),
('BrightFuture Women in Tech', 'EXTERNAL', 2, NULL, 60000, 60, '2026-07-30', 8.2, 500000, 'FEMALE', NULL, FALSE, NULL, TRUE),
('GIT CGPA Merit Award', 'COLLEGE_MERIT', 3, 1, 30000, 20, '2026-09-10', 8.5, NULL, NULL, NULL, FALSE, NULL, TRUE),
('GIT Athletics Grant', 'ATHLETICS', 3, 1, 25000, 10, '2026-09-05', 7.0, NULL, NULL, NULL, FALSE, NULL, FALSE),
('GIT MCM Scholarship', 'MCM', 3, 1, 35000, 25, '2026-09-12', 7.5, 450000, NULL, NULL, FALSE, NULL, TRUE),
('Veda CGPA Excellence', 'COLLEGE_MERIT', 4, 2, 28000, 18, '2026-09-10', 8.4, NULL, NULL, NULL, FALSE, NULL, TRUE),
('Veda Athletics Excellence', 'ATHLETICS', 4, 2, 22000, 8, '2026-09-05', 7.0, NULL, NULL, NULL, FALSE, NULL, FALSE),
('Veda MCM Support', 'MCM', 4, 2, 32000, 20, '2026-09-12', 7.4, 420000, NULL, NULL, FALSE, NULL, TRUE),
('BrightFuture Inclusive', 'EXTERNAL', 2, NULL, 45000, 50, '2026-08-10', 7.8, 350000, NULL, NULL, TRUE, NULL, FALSE),
('National Sports Assist', 'EXTERNAL', 1, NULL, 42000, 35, '2026-08-20', 7.2, 700000, NULL, NULL, FALSE, NULL, FALSE),
('State EWS Boost', 'EXTERNAL', 1, NULL, 38000, 70, '2026-07-25', 7.0, 300000, NULL, 'EWS', FALSE, 'Maharashtra', FALSE);

INSERT INTO AthleticsRecords
(student_id, sport, achievement_level, achievement_desc, academic_year, certificate_no, verified)
VALUES
(2, 'Basketball', 'STATE', 'State-level finals', '2024-25', 'CERT-BA-203', FALSE),
(3, 'Athletics', 'UNIVERSITY', 'University 100m finalist', '2024-25', 'CERT-AT-113', FALSE),
(6, 'Badminton', 'NATIONAL', 'National doubles participant', '2024-25', 'CERT-BD-087', TRUE);

INSERT INTO CollegeScholarshipCriteria
(scholarship_id, criteria_type, criteria_value, criteria_operator, weight)
VALUES
(4, 'CGPA_RANK', '10', 'TOP_N_PCT', 1.00),
(5, 'SPORT', 'Basketball,Football,Athletics,Badminton', 'IN', 1.00),
(5, 'ACHIEVEMENT_LEVEL', 'NATIONAL,STATE,UNIVERSITY', 'IN', 1.00),
(7, 'CGPA_RANK', '12', 'TOP_N_PCT', 1.00),
(8, 'SPORT', 'Badminton,Cricket,Football', 'IN', 1.00),
(8, 'ACHIEVEMENT_LEVEL', 'NATIONAL,STATE,UNIVERSITY', 'IN', 1.00);

INSERT INTO MCMCriteria
(scholarship_id, cgpa_weight, income_weight, min_cgpa_floor, max_income_ceiling, composite_cutoff)
VALUES
(6, 0.55, 0.45, 7.5, 450000, 65.00),
(9, 0.50, 0.50, 7.4, 420000, 62.00);

INSERT INTO Applications
(student_id, scholarship_id, applied_date, status, remarks)
VALUES
(1, 1, '2026-05-01', 'Pending', NULL),
(2, 3, '2026-05-02', 'Under Review', 'Documents verified'),
(6, 8, '2026-05-03', 'Approved', 'Sports committee approved'),
(3, 2, '2026-05-04', 'Rejected', 'Income above threshold');

INSERT INTO Documents (application_id, doc_type, verified) VALUES
(1, 'MARKSHEET', TRUE),
(1, 'INCOME_CERT', FALSE),
(2, 'MARKSHEET', TRUE),
(2, 'INCOME_CERT', TRUE),
(3, 'SPORTS_CERT', TRUE),
(3, 'MARKSHEET', TRUE);

INSERT INTO EligibilityLog (student_id, scholarship_id, is_eligible, reason, predicted_score, model_version) VALUES
(1, 1, TRUE, 'Matches min cgpa and income', 84, 'external_v1'),
(2, 3, TRUE, 'Gender + cgpa met', 90, 'external_v1'),
(6, 8, TRUE, 'Verified athletics record', 76, 'athletics_v1'),
(3, 2, FALSE, 'Income above threshold', 40, 'external_v1');

INSERT INTO Disbursements (application_id, amount_paid, payment_date, payment_mode, transaction_ref) VALUES
(3, 22000, '2026-05-10', 'Direct Credit', 'TXN-2231');
