"use client";
import { signIn } from "next-auth/react";
import { useState,type FormEvent } from "react";
export default function Login() {
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
 async function login(e:FormEvent) {
  e.preventDefault();setErr("");setBusy(true);
  try { const res=await signIn("credentials",{email,password,redirect:false}); if(res?.error){setErr("Incorrect credentials or inactive account");return;} window.location.assign("/"); }
  catch {setErr("Unable to sign in. Check server logs.");} finally {setBusy(false);} }
 return <main className="flex min-h-screen items-center justify-center px-5"><div className="panel w-full max-w-md space-y-6"><div><h1 className="text-4xl font-black text-emerald-400">SkillSync</h1><p className="muted mt-2">Log in as a student, mentor or admin</p></div><form onSubmit={login} className="space-y-4"><label className="block space-y-2"><span>Email</span><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username" /></label><label className="block space-y-2"><span>Password</span><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" /></label>{err&&<p className="text-red-300" role="alert">{err}</p>}<button className="btn w-full" disabled={busy}>{busy?"Signing in...":"Sign in"}</button></form><p className="muted text-xs">Accounts are created by an administrator using the local account setup command. No public self-registration.</p></div></main>;
}
