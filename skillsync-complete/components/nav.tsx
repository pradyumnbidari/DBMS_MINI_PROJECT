"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { AppRole } from "@/types/next-auth";
const links:Record<AppRole,{href:string;label:string}[]> = {
 student:[{href:"/dashboard",label:"Dashboard"},{href:"/profile",label:"Profile"},{href:"/skills",label:"My Skills"},{href:"/skill-gaps",label:"Skill Gaps"},{href:"/projects",label:"Projects"},{href:"/certifications",label:"Certifications"},{href:"/progress",label:"Progress"},{href:"/history",label:"History"},{href:"/mentor-feedback",label:"Mentor Feedback"}],
 mentor:[{href:"/mentor",label:"Mentor Workspace"}],
 admin:[{href:"/admin",label:"Admin Reports"}]
};
export default function Nav({role,name}:{role:AppRole;name:string}) {
 return <header className="border-b border-slate-800 bg-[#101a30]"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-5 py-5"><div><Link href="/" className="text-3xl font-black text-emerald-400">SkillSync</Link><p className="muted text-xs">Smart Career & Skill Recommendation Portal</p></div><div className="flex items-center gap-3"><span className="muted text-sm">{name} · {role}</span><button className="btn-muted text-sm" onClick={()=>signOut({callbackUrl:"/login"})}>Sign out</button></div></div><nav className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-3 px-5 pb-4">{links[role].map(l=><Link className="text-sm text-emerald-300 hover:text-white" href={l.href} key={l.href}>{l.label}</Link>)}</nav></header>;
}
