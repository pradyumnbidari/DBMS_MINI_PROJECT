import pool from "@/lib/db";
import {currentUser,unauthorized,forbidden,apiError} from "@/lib/permissions";
import type {RowDataPacket} from "mysql2";
export async function GET(){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="admin")return forbidden();
 const [rows]=await pool.execute<RowDataPacket[]>("SELECT user_id,full_name,email,role,student_id,is_active,DATE_FORMAT(created_at,'%Y-%m-%d') AS created_at FROM app_users ORDER BY role,full_name");return Response.json({success:true,users:rows});
 }catch(e){return apiError(e,"Admin users")}}
