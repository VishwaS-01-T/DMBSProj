CREATE OR REPLACE VIEW college_scholarship_summary AS
SELECT
  s.scholarship_id,
  s.name,
  s.scholarship_type,
  s.institution_id,
  s.seats_available,
  s.deadline,
  COUNT(a.application_id) AS applications_count,
  ROUND((COUNT(a.application_id) / NULLIF(s.seats_available, 0)) * 100, 2) AS seat_fill_pct
FROM Scholarships s
LEFT JOIN Applications a ON s.scholarship_id = a.scholarship_id
WHERE s.scholarship_type IN ('COLLEGE_MERIT', 'ATHLETICS', 'MCM')
GROUP BY s.scholarship_id;
