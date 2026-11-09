import pool from "@/lib/db";
import {currentUser,unauthorized,forbidden,invalid,apiError,positiveInt} from "@/lib/permissions";
import type {RowDataPacket} from "mysql2";
import {z} from "zod";
const schema=z.object({title:z.string().trim().min(2).max(150),area:z.string().trim().min(2).max(100)});
export async function GET(){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="student"||!u.studentId)return forbidden();
 const [rows]=await pool.execute<RowDataPacket[]>("SELECT project_id,project_title,project_area FROM projects WHERE student_id=? ORDER BY project_id DESC",[u.studentId]);return Response.json({success:true,projects:rows});}catch(e){return apiError(e,"Projects GET")}}
export async function POST(req:Request){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="student"||!u.studentId)return forbidden();const parsed=schema.safeParse(await req.json());if(!parsed.success)return invalid("Enter project title and area");
 await pool.execute("INSERT INTO projects(student_id,project_title,project_area) VALUES (?,?,?)",[u.studentId,parsed.data.title,parsed.data.area]);return Response.json({success:true});}catch(e){return apiError(e,"Projects POST")}}
export async function DELETE(req:Request){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="student"||!u.studentId)return forbidden();const id=positiveInt(new URL(req.url).searchParams.get("id"));if(!id)return invalid();await pool.execute("DELETE FROM projects WHERE project_id=? AND student_id=?",[id,u.studentId]);return Response.json({success:true})}catch(e){return apiError(e,"Projects DELETE")}}
