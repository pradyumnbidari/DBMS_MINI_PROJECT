import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import type { AppRole } from "@/types/next-auth";
interface LoginRow extends RowDataPacket {
 user_id: number; full_name: string; email: string; password_hash: string;
 role: AppRole; student_id: number | null; is_active: number;
}
const schema = z.object({ email: z.string().email().max(190), password: z.string().min(1).max(128) });
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: process.env.NODE_ENV === "development",
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [Credentials({
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      const parsed = schema.safeParse(credentials);
      if (!parsed.success) return null;
      const [rows] = await pool.execute<LoginRow[]>(
        "SELECT user_id,full_name,email,password_hash,role,student_id,is_active FROM app_users WHERE email=? LIMIT 1",
        [parsed.data.email.trim().toLowerCase()]
      );
      const user = rows[0];
      if (!user || !user.is_active) return null;
      if (!(await bcrypt.compare(parsed.data.password, user.password_hash))) return null;
      return { id: String(user.user_id), name: user.full_name, email: user.email, role: user.role, studentId: user.student_id };
    }
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = user.role; token.studentId = user.studentId; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.role = token.role as AppRole;
        session.user.studentId = token.studentId as number | null;
      }
      return session;
    }
  }
});
