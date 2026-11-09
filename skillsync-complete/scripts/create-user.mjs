import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { input,password,select } from "@inquirer/prompts";
const db=await mysql.createConnection({host:process.env.MYSQL_HOST||"127.0.0.1",port:Number(process.env.MYSQL_PORT||3306),user:process.env.MYSQL_USER,password:process.env.MYSQL_PASSWORD,database:process.env.MYSQL_DATABASE||"skillsync_review"});
try{const role=await select({message:"Account role",choices:[{name:"Student",value:"student"},{name:"Mentor",value:"mentor"},{name:"Admin",value:"admin"}]});
let name,email,studentId=null;
if(role==="student") {const [rows]=await db.query("SELECT student_id,full_name,email FROM students ORDER BY full_name");if(!rows.length)throw Error("No student records in database");studentId=await select({message:"Choose existing student",choices:rows.map(s=>({name:`${s.full_name} (${s.email})`,value:s.student_id}))});const student=rows.find(s=>s.student_id===studentId);name=student.full_name;email=student.email.toLowerCase();}
else {name=(await input({message:"Full name",validate:v=>v.trim().length>=2||"Enter a name"})).trim();email=(await input({message:"Email",validate:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||"Enter valid email"})).trim().toLowerCase();}
const [existing]=await db.execute("SELECT user_id FROM app_users WHERE email=? OR (student_id IS NOT NULL AND student_id=?)",[email,studentId]);if(existing.length)throw Error("An account already exists for that email/student. Nothing changed.");
const pw=await password({message:"Password (min 12 chars)",mask:"*",validate:v=>v.length>=12||"Minimum 12 characters"});const confirmation=await password({message:"Confirm password",mask:"*"});if(pw!==confirmation)throw Error("Passwords do not match. Nothing saved.");
await db.execute("INSERT INTO app_users(full_name,email,password_hash,role,student_id) VALUES(?,?,?,?,?)",[name,email,await bcrypt.hash(pw,12),role,studentId]);console.log(`✅ ${role} account created: ${email} (password never displayed)`);
}catch(e){console.error("Account creation:",e.message);process.exitCode=1}finally{await db.end()}
