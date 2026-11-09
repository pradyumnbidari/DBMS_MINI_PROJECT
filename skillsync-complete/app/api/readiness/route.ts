import pool from "@/lib/db";
import { currentUser, canAccessStudent, unauthorized, forbidden, apiError, positiveInt, invalid } from "@/lib/permissions";
import type { RowDataPacket } from "mysql2";
export async function GET(request:Request){
 try {const user=await currentUser(); if(!user)return unauthorized();
  const query=new URL(request.url).searchParams;
  const studentId=user.role==="student"? user.studentId : positiveInt(query.get("studentId"));
  if(!studentId)return invalid("Specify a valid studentId");
  if(!(await canAccessStudent(user,studentId)))return forbidden();
  const [rows]=await pool.execute<RowDataPacket[]>(
   "SELECT student_id,career_id,career_name,readiness_percent,estimated_learning_hours FROM v_career_readiness WHERE student_id=? ORDER BY readiness_percent DESC,estimated_learning_hours ASC",[studentId]);
  return Response.json({success:true,recommendations:rows});
 }catch(e){return apiError(e,"Readiness API")}
}
