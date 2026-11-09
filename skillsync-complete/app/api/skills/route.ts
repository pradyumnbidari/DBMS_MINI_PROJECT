import {currentUser, unauthorized, forbidden, apiError,invalid} from "@/lib/permissions";
import pool from "@/lib/db";
import {z} from "zod";
import type {RowDataPacket} from "mysql2";
export async function GET(){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="student"||!u.studentId)return forbidden();
 const [rows]=await pool.execute<RowDataPacket[]>(`SELECT sk.skill_id,sk.skill_name,sk.hours_per_level,COALESCE(ss.proficiency,0) AS proficiency FROM skills sk LEFT JOIN student_skills ss ON ss.skill_id=sk.skill_id AND ss.student_id=? ORDER BY sk.skill_name`,[u.studentId]);
 return Response.json({success:true,skills:rows});}catch(e){return apiError(e,"Skills GET")}}
const schema=z.object({skillId:z.number().int().positive(),proficiency:z.number().int().min(0).max(5)});
export async function PUT(request:Request){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="student"||!u.studentId)return forbidden();
 const parsed=schema.safeParse(await request.json());if(!parsed.success)return invalid("Invalid skill level");
 const {skillId,proficiency}=parsed.data;const conn=await pool.getConnection();
 try{await conn.beginTransaction();
   const [exists]=await conn.execute<RowDataPacket[]>("SELECT skill_id FROM skills WHERE skill_id=?",[skillId]);
   if(!exists.length){await conn.rollback();return invalid("Skill not found")}
   if(proficiency===0){await conn.execute("DELETE FROM student_skills WHERE student_id=? AND skill_id=?",[u.studentId,skillId]);}
   else{await conn.execute("INSERT INTO student_skills (student_id,skill_id,proficiency) VALUES (?,?,?) ON DUPLICATE KEY UPDATE proficiency=VALUES(proficiency)",[u.studentId,skillId,proficiency]);}
   await conn.execute("INSERT INTO recommendation_history (student_id,career_id,readiness_percent,estimated_learning_hours) SELECT student_id,career_id,readiness_percent,estimated_learning_hours FROM v_career_readiness WHERE student_id=?",[u.studentId]);
   await conn.commit();
 }catch(e){await conn.rollback();throw e}finally{conn.release()}
 return Response.json({success:true,message:"Saved; recommendations recalculated"});
 }catch(e){return apiError(e,"Skills PUT")}}
