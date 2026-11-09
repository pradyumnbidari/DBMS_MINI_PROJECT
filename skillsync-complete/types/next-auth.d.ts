import type { DefaultSession } from "next-auth";
export type AppRole = "student" | "mentor" | "admin";
declare module "next-auth" {
  interface User { role?: AppRole; studentId?: number | null }
  interface Session {
    user: { id: string; role: AppRole; studentId: number | null } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT { role?: AppRole; studentId?: number | null }
}
