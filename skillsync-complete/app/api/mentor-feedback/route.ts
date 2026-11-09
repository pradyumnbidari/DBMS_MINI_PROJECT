import pool from "@/lib/db";
import { mentorCollection } from "@/lib/mongodb";
import {currentUser, canAccessStudent, unauthorized, forbidden, invalid, positiveInt, apiError} from "@/lib/permissions";
import {z} from "zod";
import type {RowDataPacket} from "mysql2";
async function getStudent(studentId:number){const [rows]=await pool.execute<RowDataPacket[]>("SELECT full_name FROM students WHERE student_id=?",[studentId]);return rows[0]?.full_name as string|undefined}
export async function GET(request:Request){try{const u=await currentUser();if(!u)return unauthorized();const studentId=u.role==="student"?u.studentId:positiveInt(new URL(request.url).searchParams.get("studentId"));
 if(!studentId)return invalid("Student ID is required");if(!(await canAccessStudent(u,studentId)))return forbidden();
 const studentName=await getStudent(studentId);if(!studentName)return invalid("Student not found");
 const collection=await mentorCollection();const feedback=await collection.findOne({$or:[{student_id:studentId},{student_name:studentName}]},{projection:{_id:0}});
 return Response.json({success:true,feedback:feedback??null});
 }catch(e){return apiError(e,"MongoDB mentor feedback GET")}}
const schema=z.object({studentId:z.number().int().positive(),feedback:z.string().trim().min(4).max(2000),recommendedSkills:z.array(z.object({skill:z.string().trim().min(1).max(100),priority:z.enum(["High","Medium","Low"])})).min(1).max(8)});
export async function PUT(request:Request){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="mentor"&&u.role!=="admin")return forbidden();
 const parsed=schema.safeParse(await request.json());if(!parsed.success)return invalid("Invalid feedback format");const {studentId,feedback,recommendedSkills}=parsed.data;
 if(!(await canAccessStudent(u,studentId)))return forbidden();const studentName=await getStudent(studentId);if(!studentName)return invalid("Student not found");
 const collection=await mentorCollection();
 await collection.updateOne({$or:[{student_id:studentId},{student_name:studentName}]},{$set:{student_id:studentId,student_name:studentName,mentor_name:u.fullName,feedback,recommended_skills:recommendedSkills.map(s=>({skill:s.skill,priority:s.priority})),updated_at:new Date()},$setOnInsert:{career_goal:"Not selected",progress:{status:"Not started",completion_percentage:0}}},{upsert:true});
 return Response.json({success:true,message:"Mentor feedback saved to MongoDB"});
 }catch(e){return apiError(e,"MongoDB mentor feedback PUT")}}
