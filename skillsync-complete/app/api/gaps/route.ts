import pool from "@/lib/db";
import { currentUser, canAccessStudent, unauthorized, forbidden,apiError,positiveInt,invalid } from "@/lib/permissions";
import type {RowDataPacket} from "mysql2";
export async function GET(req:Request){try{const user=await currentUser();if(!user)return unauthorized();const p=new URL(req.url).searchParams;
 const studentId=user.role==="student"? user.studentId:positiveInt(p.get("studentId"));const careerId=positiveInt(p.get("careerId"));
 if(!studentId||!careerId)return invalid("studentId and careerId required");if(!(await canAccessStudent(user,studentId)))return forbidden();
 const [rows]=await pool.execute<RowDataPacket[]>(`SELECT sk.skill_name,COALESCE(ss.proficiency,0) AS current_level,cs.required_level AS target_level,cs.importance,GREATEST(cs.required_level-COALESCE(ss.proficiency,0),0) AS missing_levels,GREATEST(cs.required_level-COALESCE(ss.proficiency,0),0)*sk.hours_per_level AS learning_hours,cs.importance*GREATEST(cs.required_level-COALESCE(ss.proficiency,0),0) AS priority_score FROM career_skills cs JOIN skills sk ON sk.skill_id=cs.skill_id LEFT JOIN student_skills ss ON ss.student_id=? AND ss.skill_id=cs.skill_id WHERE cs.career_id=? AND COALESCE(ss.proficiency,0)<cs.required_level ORDER BY priority_score DESC,learning_hours DESC`,[studentId,careerId]);
 return Response.json({success:true,gaps:rows});
 }catch(e){return apiError(e,"Gaps GET")}}
