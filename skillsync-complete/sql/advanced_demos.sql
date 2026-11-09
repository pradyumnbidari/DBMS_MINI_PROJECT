-- NON-DESTRUCTIVE: run only after npm run setup:db
USE skillsync_review;
-- The setup installs three skill audit triggers, a stored procedure and
-- a missing-level function when the database user has permission.
SHOW TRIGGERS LIKE 'student_skills';
SHOW PROCEDURE STATUS WHERE Db='skillsync_review' AND Name='sp_student_career_report';
SHOW FUNCTION STATUS WHERE Db='skillsync_review' AND Name='fn_missing_levels';
-- If the routine was created successfully:
CALL sp_student_career_report(1);
SELECT fn_missing_levels(2,4) AS sample_missing_levels;
-- Multi-table reporting examples
SELECT s.branch,COUNT(p.project_id) AS project_count FROM students s
LEFT JOIN projects p ON p.student_id=s.student_id GROUP BY s.branch;
SELECT c.career_name,ROUND(AVG(v.readiness_percent),1) AS avg_readiness
FROM careers c JOIN v_career_readiness v ON v.career_id=c.career_id
GROUP BY c.career_id,c.career_name ORDER BY avg_readiness DESC;
SELECT * FROM audit_logs ORDER BY audit_id DESC LIMIT 10;
