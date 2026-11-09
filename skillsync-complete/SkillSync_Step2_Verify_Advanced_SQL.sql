-- SKILLSYNC STEP 2: ADVANCED DBMS VERIFICATION (MySQL 8+)
-- Safe for the existing skillsync_review database.
-- One temporary UPDATE is rolled back; existing records are preserved.
USE skillsync_review;

SELECT '1. Views' AS verification_step;
SHOW FULL TABLES WHERE Table_type = 'VIEW';
SELECT career_name, ROUND(AVG(readiness_percent),1) AS avg_readiness
FROM v_career_readiness GROUP BY career_name ORDER BY avg_readiness DESC;

SELECT '2. JOIN and GROUP BY' AS verification_step;
SELECT s.branch, COUNT(p.project_id) AS projects
FROM students s LEFT JOIN projects p ON p.student_id=s.student_id
GROUP BY s.branch ORDER BY projects DESC;

SELECT '3. HAVING' AS verification_step;
SELECT sk.skill_name, COUNT(*) AS careers_requiring_skill
FROM skills sk JOIN career_skills cs ON cs.skill_id=sk.skill_id
GROUP BY sk.skill_id,sk.skill_name HAVING COUNT(*) >= 2
ORDER BY careers_requiring_skill DESC,sk.skill_name;

SELECT '4. Subquery' AS verification_step;
SELECT full_name,career_name,readiness_percent
FROM v_career_readiness
WHERE readiness_percent > (SELECT AVG(readiness_percent) FROM v_career_readiness)
ORDER BY readiness_percent DESC LIMIT 15;

SELECT '5. Indexes' AS verification_step;
SHOW INDEX FROM recommendation_history;
SHOW INDEX FROM learning_progress;

SELECT '6. Triggers' AS verification_step;
SHOW TRIGGERS LIKE 'student_skills';

SELECT '7. Stored procedure and function definitions' AS verification_step;
SHOW PROCEDURE STATUS WHERE Db='skillsync_review' AND Name='sp_student_career_report';
SHOW FUNCTION STATUS WHERE Db='skillsync_review' AND Name='fn_missing_levels';

SELECT '8. Execute stored procedure' AS verification_step;
CALL sp_student_career_report(1);
SELECT '9. Execute stored function' AS verification_step;
SELECT fn_missing_levels(2,4) AS expected_two_missing_levels;

SELECT '10. Transaction, UPDATE trigger, and ROLLBACK (original data is preserved)' AS verification_step;
SET @test_student = (SELECT student_id FROM student_skills ORDER BY student_id,skill_id LIMIT 1);
SET @test_skill = (SELECT skill_id FROM student_skills WHERE student_id=@test_student ORDER BY skill_id LIMIT 1);
SET @original_level = (SELECT proficiency FROM student_skills WHERE student_id=@test_student AND skill_id=@test_skill);
SET @previous_audit_id = (SELECT COALESCE(MAX(audit_id),0) FROM audit_logs);
SELECT @test_student AS student_id, @test_skill AS skill_id, @original_level AS original_level;
START TRANSACTION;
UPDATE student_skills
SET proficiency=IF(@original_level<5,@original_level+1,@original_level-1)
WHERE student_id=@test_student AND skill_id=@test_skill;
SELECT student_id,skill_id,proficiency AS temporary_level FROM student_skills
WHERE student_id=@test_student AND skill_id=@test_skill;
SELECT audit_id,action,details FROM audit_logs
WHERE audit_id>@previous_audit_id AND action='SKILL_UPDATED'
ORDER BY audit_id DESC;
ROLLBACK;
SELECT student_id,skill_id,proficiency AS level_after_rollback FROM student_skills
WHERE student_id=@test_student AND skill_id=@test_skill;
SELECT COUNT(*) AS new_audit_rows_after_rollback FROM audit_logs WHERE audit_id>@previous_audit_id;

SELECT 'Verification finished. No permanent data changes.' AS status;
