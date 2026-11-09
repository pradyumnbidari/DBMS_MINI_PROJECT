import { auth } from "@/auth";
import pool from "@/lib/db";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import type { AppRole } from "@/types/next-auth";
export type CurrentUser = { userId: number; fullName: string; email: string; role: AppRole; studentId: number | null };
interface AccountRow extends RowDataPacket { user_id: number; full_name: string; email: string; role: AppRole; student_id: number|null; is_active: number }
export async function currentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const id = Number(session?.user?.id);
  if (!Number.isInteger(id) || id < 1) return null;
  const [rows] = await pool.execute<AccountRow[]>(
    "SELECT user_id,full_name,email,role,student_id,is_active FROM app_users WHERE user_id=? LIMIT 1", [id]);
  const row = rows[0];
  if (!row || !row.is_active) return null;
  return { userId: row.user_id, fullName: row.full_name, email: row.email, role: row.role, studentId: row.student_id };
}
export async function requirePageRole(...roles: AppRole[]) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(user.role === "admin" ? "/admin" : user.role === "mentor" ? "/mentor" : "/dashboard");
  return user;
}
export async function canAccessStudent(user: CurrentUser, studentId: number) {
  if (user.role === "admin") return true;
  if (user.role === "student") return user.studentId === studentId;
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT 1 FROM mentor_assignments WHERE mentor_user_id=? AND student_id=? LIMIT 1", [user.userId, studentId]);
  return rows.length > 0;
}
export function apiError(e: unknown, context: string) {
  console.error(context, e);
  return Response.json({ success: false, message: "Server error. Check your terminal." }, { status: 500 });
}
export function unauthorized() { return Response.json({ success: false, message: "Sign in required" }, { status: 401 }); }
export function forbidden() { return Response.json({ success: false, message: "Access denied" }, { status: 403 }); }
export function invalid(message="Invalid request") { return Response.json({ success:false, message }, { status:400 }); }
export function positiveInt(v: unknown) { const n=Number(v); return Number.isSafeInteger(n) && n>0 ? n : null; }
