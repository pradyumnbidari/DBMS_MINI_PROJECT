-- SkillSync final DBMS review queries (READ ONLY)
USE skillsync_review;
SHOW TABLES;
SELECT 'students' category, COUNT(*) total FROM students
UNION ALL SELECT 'skills',COUNT(*) FROM skills
UNION ALL SELECT 'careers',COUNT(*) FROM careers
UNION ALL SELECT 'projects',COUNT(*) FROM projects
UNION ALL SELECT 'certifications',COUNT(*) FROM certifications
UNION ALL SELECT 'career_skills',COUNT(*) FROM career_skills
UNION ALL SELECT 'student_skills',COUNT(*) FROM student_skills;
-- JOIN + GROUP BY + AVG
SELECT s.branch, COUNT(DISTINCT s.student_id) student_count,
       COUNT(p.project_id) total_projects
FROM students s LEFT JOIN projects p ON p.student_id=s.student_id
GROUP BY s.branch ORDER BY total_projects DESC;
-- GROUP BY / HAVING
SELECT sk.skill_name,COUNT(cs.career_id) careers_requiring_skill,
       ROUND(AVG(cs.required_level),2) avg_level
FROM skills sk JOIN career_skills cs ON cs.skill_id=sk.skill_id
GROUP BY sk.skill_id,sk.skill_name HAVING COUNT(cs.career_id)>=2
ORDER BY careers_requiring_skill DESC;
-- Subquery
SELECT full_name,branch FROM students WHERE student_id IN
  (SELECT student_id FROM projects GROUP BY student_id HAVING COUNT(*)>=2);
-- View
SELECT full_name, career_name, readiness_percent, estimated_learning_hours
FROM v_career_readiness ORDER BY student_id,readiness_percent DESC LIMIT 30;
-- Stored procedure and function
CALL sp_student_career_report(1);
SELECT fn_missing_levels(2,4) AS sample_missing_levels;
-- Triggers / indexes / audit
SHOW TRIGGERS LIKE 'student_skills';
SHOW INDEX FROM recommendation_history;
SELECT * FROM audit_logs ORDER BY audit_id DESC LIMIT 10;
-- Transactions were used by scripts/seed-demo.mjs
