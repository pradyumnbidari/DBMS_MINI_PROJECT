import pool from "@/lib/db";
import {currentUser,unauthorized,forbidden,apiError} from "@/lib/permissions";
import type {RowDataPacket} from "mysql2";
export async function GET(){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="admin")return forbidden();
 const queries=[
 `SELECT s.full_name,s.branch,COUNT(ss.skill_id) AS skills_known,ROUND(AVG(ss.proficiency),2) AS average_proficiency FROM students s LEFT JOIN student_skills ss ON ss.student_id=s.student_id GROUP BY s.student_id,s.full_name,s.branch ORDER BY skills_known DESC`,
 `SELECT sk.skill_name,COUNT(cs.career_id) AS careers_requiring_skill,ROUND(AVG(cs.required_level),2) AS average_required_level FROM skills sk JOIN career_skills cs ON cs.skill_id=sk.skill_id GROUP BY sk.skill_id,sk.skill_name ORDER BY careers_requiring_skill DESC,sk.skill_name`,
 `SELECT career_name,ROUND(AVG(readiness_percent),1) AS average_readiness,ROUND(AVG(estimated_learning_hours),0) AS average_learning_hours FROM v_career_readiness GROUP BY career_name ORDER BY average_readiness DESC`,
 `SELECT s.branch,COUNT(p.project_id) AS total_projects FROM students s LEFT JOIN projects p ON p.student_id=s.student_id GROUP BY s.branch ORDER BY total_projects DESC`,
 `SELECT s.full_name,COUNT(c.certification_id) AS certifications FROM students s LEFT JOIN certifications c ON c.student_id=s.student_id GROUP BY s.student_id,s.full_name ORDER BY certifications DESC`,
 `SELECT COUNT(*) AS student_count FROM students`
 ];
 const results=await Promise.all(queries.map(async q=>(await pool.query<RowDataPacket[]>(q))[0]));
 return Response.json({success:true,skillReport:results[0],demandReport:results[1],careerReport:results[2],branchReport:results[3],certificationReport:results[4],summary:results[5][0]});
 }catch(e){return apiError(e,"Admin reports")}}
