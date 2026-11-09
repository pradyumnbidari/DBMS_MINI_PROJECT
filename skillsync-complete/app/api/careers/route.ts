import pool from "@/lib/db";
import {currentUser,unauthorized,apiError} from "@/lib/permissions";
import type {RowDataPacket} from "mysql2";
export async function GET(){try{const u=await currentUser();if(!u)return unauthorized();const [rows]=await pool.execute<RowDataPacket[]>("SELECT career_id, career_name FROM careers ORDER BY career_name");return Response.json({success:true,careers:rows})}catch(e){return apiError(e,"Careers GET")}}
