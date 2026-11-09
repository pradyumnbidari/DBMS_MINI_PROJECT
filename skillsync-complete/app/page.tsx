import { currentUser } from "@/lib/permissions";
import { redirect } from "next/navigation";
export default async function Home() { const user=await currentUser(); redirect(!user?"/login":user.role==="mentor"?"/mentor":user.role==="admin"?"/admin":"/dashboard"); }
