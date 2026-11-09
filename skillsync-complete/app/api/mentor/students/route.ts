import pool from "@/lib/db";
import {currentUser,unauthorized,forbidden,apiError} from "@/lib/permissions";
import type {RowDataPacket} from "mysql2";
export async function GET(){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="mentor"&&u.role!=="admin")return forbidden();
 const query=u.role==="admin"?"SELECT student_id,full_name,branch FROM students ORDER BY full_name":"SELECT s.student_id,s.full_name,s.branch FROM students s JOIN mentor_assignments a ON a.student_id=s.student_id WHERE a.mentor_user_id=? ORDER BY s.full_name";
 const [rows]=await pool.execute<RowDataPacket[]>(query,u.role==="admin"?[]:[u.userId]);return Response.json({success:true,students:rows});
 }catch(e){return apiError(e,"Mentor students")}}
