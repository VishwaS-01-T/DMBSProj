CREATE TABLE IF NOT EXISTS Institutions (
  institution_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  type ENUM('CENTRAL','STATE','DEEMED','PRIVATE') NOT NULL,
  accreditation VARCHAR(32),
  state VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS Providers (
  provider_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  type ENUM('GOVERNMENT','NGO','PRIVATE','INSTITUTION') NOT NULL,
  contact_email VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS Students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  dob DATE NOT NULL,
  gender ENUM('MALE','FEMALE','OTHER') NOT NULL,
  caste_category ENUM('GEN','OBC','SC','ST','EWS') NOT NULL,
  annual_family_income INT NOT NULL,
  cgpa DECIMAL(3,1) NOT NULL,
  disability_status BOOLEAN NOT NULL DEFAULT FALSE,
  state VARCHAR(60) NOT NULL,
  institution_id INT NOT NULL,
  department VARCHAR(60) NOT NULL,
  year_of_study INT NOT NULL,
  enrollment_no VARCHAR(32) NOT NULL UNIQUE,
  FOREIGN KEY (institution_id) REFERENCES Institutions(institution_id)
);

CREATE TABLE IF NOT EXISTS Scholarships (
  scholarship_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(140) NOT NULL,
  scholarship_type ENUM('EXTERNAL','COLLEGE_MERIT','ATHLETICS','MCM') NOT NULL,
  provider_id INT NOT NULL,
  institution_id INT NULL,
  amount_inr INT NOT NULL,
  seats_available INT NOT NULL,
  deadline DATE NOT NULL,
  min_cgpa DECIMAL(3,1) NULL,
  max_family_income INT NULL,
  gender_req ENUM('MALE','FEMALE','OTHER') NULL,
  category_req ENUM('GEN','OBC','SC','ST','EWS') NULL,
  disability_req BOOLEAN NOT NULL DEFAULT FALSE,
  state_req VARCHAR(60) NULL,
  renewable BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (provider_id) REFERENCES Providers(provider_id),
  FOREIGN KEY (institution_id) REFERENCES Institutions(institution_id)
);

CREATE TABLE IF NOT EXISTS Applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  scholarship_id INT NOT NULL,
  applied_date DATE NOT NULL,
  status ENUM('Pending','Under Review','Approved','Rejected','Deadline Passed') NOT NULL,
  remarks VARCHAR(255),
  FOREIGN KEY (student_id) REFERENCES Students(student_id),
  FOREIGN KEY (scholarship_id) REFERENCES Scholarships(scholarship_id)
);

CREATE TABLE IF NOT EXISTS AthleticsRecords (
  record_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  sport VARCHAR(60) NOT NULL,
  achievement_level ENUM('NATIONAL','STATE','UNIVERSITY','INTER_COLLEGE','COLLEGE') NOT NULL,
  achievement_desc VARCHAR(160) NOT NULL,
  academic_year VARCHAR(16) NOT NULL,
  certificate_no VARCHAR(40) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

CREATE TABLE IF NOT EXISTS CollegeScholarshipCriteria (
  criteria_id INT AUTO_INCREMENT PRIMARY KEY,
  scholarship_id INT NOT NULL,
  criteria_type ENUM('CGPA_RANK','CGPA_ABSOLUTE','SPORT','ACHIEVEMENT_LEVEL','DEPT_RESTRICT','YEAR_RESTRICT') NOT NULL,
  criteria_value VARCHAR(120) NOT NULL,
  criteria_operator ENUM('GTE','LTE','IN','EQ','TOP_N_PCT') NOT NULL,
  weight DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  FOREIGN KEY (scholarship_id) REFERENCES Scholarships(scholarship_id)
);

CREATE TABLE IF NOT EXISTS MCMCriteria (
  mcm_id INT AUTO_INCREMENT PRIMARY KEY,
  scholarship_id INT NOT NULL,
  cgpa_weight DECIMAL(4,2) NOT NULL,
  income_weight DECIMAL(4,2) NOT NULL,
  min_cgpa_floor DECIMAL(3,1) NOT NULL,
  max_income_ceiling INT NOT NULL,
  composite_cutoff DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (scholarship_id) REFERENCES Scholarships(scholarship_id)
);

CREATE TABLE IF NOT EXISTS Documents (
  doc_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  doc_type ENUM('INCOME_CERT','CASTE_CERT','MARKSHEET','SPORTS_CERT','BANK_STATEMENT','BONAFIDE') NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (application_id) REFERENCES Applications(application_id)
);

CREATE TABLE IF NOT EXISTS EligibilityLog (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  scholarship_id INT NOT NULL,
  is_eligible BOOLEAN NOT NULL,
  checked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reason VARCHAR(255),
  predicted_score TINYINT,
  model_version VARCHAR(32),
  FOREIGN KEY (student_id) REFERENCES Students(student_id),
  FOREIGN KEY (scholarship_id) REFERENCES Scholarships(scholarship_id)
);

CREATE TABLE IF NOT EXISTS Disbursements (
  disbursement_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  amount_paid INT NOT NULL,
  payment_date DATE NOT NULL,
  payment_mode ENUM('NEFT','Cheque','Direct Credit') NOT NULL,
  transaction_ref VARCHAR(60) NOT NULL,
  FOREIGN KEY (application_id) REFERENCES Applications(application_id)
);
