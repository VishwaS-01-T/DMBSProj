-- Query 1: External Scholarship Eligibility Match
SELECT s.*
FROM Scholarships s
JOIN Students st ON st.student_id = ?
LEFT JOIN Applications a
  ON a.student_id = st.student_id AND a.scholarship_id = s.scholarship_id
WHERE s.scholarship_type = 'EXTERNAL'
  AND s.deadline >= CURDATE()
  AND a.application_id IS NULL
  AND (s.min_cgpa IS NULL OR st.cgpa >= s.min_cgpa)
  AND (s.max_family_income IS NULL OR st.annual_family_income <= s.max_family_income)
  AND (s.gender_req IS NULL OR st.gender = s.gender_req)
  AND (s.category_req IS NULL OR st.caste_category = s.category_req)
  AND (s.disability_req = FALSE OR st.disability_status = TRUE)
  AND (s.state_req IS NULL OR st.state = s.state_req)
ORDER BY s.amount_inr DESC;

-- Query 2: Applicant Ranking (Window Functions)
SELECT
  a.application_id,
  a.scholarship_id,
  a.student_id,
  st.name,
  st.cgpa,
  st.annual_family_income,
  RANK() OVER (PARTITION BY a.scholarship_id ORDER BY st.cgpa DESC, st.annual_family_income ASC) AS applicant_rank,
  CASE
    WHEN RANK() OVER (PARTITION BY a.scholarship_id ORDER BY st.cgpa DESC, st.annual_family_income ASC) <= s.seats_available
    THEN 'Likely Selected'
    ELSE 'Waitlist'
  END AS selection_hint
FROM Applications a
JOIN Students st ON a.student_id = st.student_id
JOIN Scholarships s ON a.scholarship_id = s.scholarship_id
WHERE a.scholarship_id = ?;

-- Query 6: CGPA Merit Matching (PERCENT_RANK)
WITH ranked AS (
  SELECT
    st.student_id,
    st.institution_id,
    st.department,
    st.year_of_study,
    st.cgpa,
    PERCENT_RANK() OVER (
      PARTITION BY st.institution_id, st.department, st.year_of_study
      ORDER BY st.cgpa DESC
    ) AS pct_rank
  FROM Students st
)
SELECT
  r.student_id,
  r.department,
  r.year_of_study,
  r.cgpa,
  r.pct_rank,
  s.scholarship_id,
  s.name
FROM ranked r
JOIN Scholarships s
  ON s.scholarship_type = 'COLLEGE_MERIT'
  AND s.institution_id = r.institution_id
JOIN CollegeScholarshipCriteria c
  ON c.scholarship_id = s.scholarship_id
  AND c.criteria_type = 'CGPA_RANK'
WHERE r.pct_rank <= (CAST(c.criteria_value AS DECIMAL(5,2)) / 100);

-- Query 7: Athletics Matching
SELECT
  ar.record_id,
  ar.student_id,
  ar.sport,
  ar.achievement_level,
  s.scholarship_id,
  s.name
FROM AthleticsRecords ar
JOIN Students st ON st.student_id = ar.student_id
JOIN Scholarships s
  ON s.scholarship_type = 'ATHLETICS'
  AND s.institution_id = st.institution_id
JOIN CollegeScholarshipCriteria c1
  ON c1.scholarship_id = s.scholarship_id AND c1.criteria_type = 'SPORT'
JOIN CollegeScholarshipCriteria c2
  ON c2.scholarship_id = s.scholarship_id AND c2.criteria_type = 'ACHIEVEMENT_LEVEL'
JOIN JSON_TABLE(
  CONCAT('["', REPLACE(c1.criteria_value, ',', '","'), '"]'),
  '$[*]' COLUMNS (sport_val VARCHAR(60) PATH '$')
) js ON js.sport_val = ar.sport
JOIN JSON_TABLE(
  CONCAT('["', REPLACE(c2.criteria_value, ',', '","'), '"]'),
  '$[*]' COLUMNS (level_val VARCHAR(40) PATH '$')
) jl ON jl.level_val = ar.achievement_level
WHERE ar.verified = TRUE;

-- Query 8: MCM Composite Score
WITH eligible AS (
  SELECT
    st.student_id,
    st.name,
    st.cgpa,
    st.annual_family_income,
    s.scholarship_id,
    mc.cgpa_weight,
    mc.income_weight,
    mc.min_cgpa_floor,
    mc.max_income_ceiling,
    mc.composite_cutoff
  FROM Students st
  JOIN Scholarships s ON s.scholarship_type = 'MCM' AND s.institution_id = st.institution_id
  JOIN MCMCriteria mc ON mc.scholarship_id = s.scholarship_id
  WHERE st.cgpa >= mc.min_cgpa_floor
    AND st.annual_family_income <= mc.max_income_ceiling
)
SELECT
  e.student_id,
  e.name,
  e.scholarship_id,
  ROUND((e.cgpa / 10) * e.cgpa_weight * 100, 2) AS cgpa_component,
  ROUND((1 - (e.annual_family_income / e.max_income_ceiling)) * e.income_weight * 100, 2) AS income_component,
  ROUND(
    ((e.cgpa / 10) * e.cgpa_weight * 100) +
    ((1 - (e.annual_family_income / e.max_income_ceiling)) * e.income_weight * 100),
    2
  ) AS composite_score
FROM eligible e
WHERE
  (((e.cgpa / 10) * e.cgpa_weight * 100) +
   ((1 - (e.annual_family_income / e.max_income_ceiling)) * e.income_weight * 100)) >= e.composite_cutoff
ORDER BY composite_score DESC;

-- Query 10: College Scholarship Summary View
SELECT * FROM college_scholarship_summary;
