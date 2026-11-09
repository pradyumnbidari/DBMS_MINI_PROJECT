import pool from "@/lib/db";
import {currentUser,unauthorized,forbidden,invalid,apiError} from "@/lib/permissions";
import type {RowDataPacket} from "mysql2";
import {z} from "zod";
const schema=z.object({careerId:z.number().int().positive(),skillId:z.number().int().positive(),requiredLevel:z.number().int().min(1).max(5),importance:z.number().int().min(1).max(5)});
export async function GET(){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="admin")return forbidden();const [rows]=await pool.query<RowDataPacket[]>("SELECT c.career_id,c.career_name,s.skill_id,s.skill_name,cs.required_level,cs.importance FROM career_skills cs JOIN careers c ON c.career_id=cs.career_id JOIN skills s ON s.skill_id=cs.skill_id ORDER BY c.career_name,s.skill_name");return Response.json({success:true,requirements:rows});}catch(e){return apiError(e,"Requirements GET")}}
export async function PUT(req:Request){try{const u=await currentUser();if(!u)return unauthorized();if(u.role!=="admin")return forbidden();const parsed=schema.safeParse(await req.json());if(!parsed.success)return invalid("Invalid required level or importance");const {careerId,skillId,requiredLevel,importance}=parsed.data;
 const conn=await pool.getConnection();try{await conn.beginTransaction();await conn.execute("UPDATE career_skills SET required_level=?,importance=? WHERE career_id=? AND skill_id=?",[requiredLevel,importance,careerId,skillId]);await conn.execute("INSERT INTO audit_logs(actor_user_id,action,details) VALUES (?,?,?)",[u.userId,"CAREER_REQUIREMENT_UPDATED",JSON.stringify(parsed.data)]);await conn.commit();}catch(e){await conn.rollback();throw e}finally{conn.release()}
 return Response.json({success:true});
 }catch(e){return apiError(e,"Requirements PUT")}}
