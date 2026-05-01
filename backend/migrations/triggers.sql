DELIMITER $$

CREATE TRIGGER after_athletics_verify
AFTER UPDATE ON AthleticsRecords
FOR EACH ROW
BEGIN
  IF OLD.verified = FALSE AND NEW.verified = TRUE THEN
    INSERT INTO EligibilityLog (student_id, scholarship_id, is_eligible, reason, predicted_score, model_version)
    SELECT
      NEW.student_id,
      s.scholarship_id,
      TRUE,
      'Verified athletics record',
      75,
      'athletics_v1'
    FROM Scholarships s
    WHERE s.scholarship_type = 'ATHLETICS'
      AND s.institution_id = (SELECT institution_id FROM Students WHERE student_id = NEW.student_id);
  END IF;
END$$

CREATE EVENT IF NOT EXISTS event_expire_applications
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 1 DAY
DO
BEGIN
  UPDATE Applications
  SET status = 'Deadline Passed'
  WHERE status = 'Pending'
    AND scholarship_id IN (
      SELECT scholarship_id FROM Scholarships WHERE deadline < CURDATE()
    );

  INSERT INTO EligibilityLog (student_id, scholarship_id, is_eligible, reason, predicted_score, model_version)
  SELECT
    a.student_id,
    a.scholarship_id,
    FALSE,
    'Deadline passed',
    NULL,
    'system_v1'
  FROM Applications a
  WHERE a.status = 'Deadline Passed'
    AND NOT EXISTS (
      SELECT 1 FROM EligibilityLog e
      WHERE e.student_id = a.student_id AND e.scholarship_id = a.scholarship_id
        AND e.reason = 'Deadline passed'
    );
END$$

DELIMITER ;
