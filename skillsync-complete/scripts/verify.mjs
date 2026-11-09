import mysql from "mysql2/promise";
import {MongoClient} from "mongodb";
const c=await mysql.createConnection({host:process.env.MYSQL_HOST||"127.0.0.1",port:Number(process.env.MYSQL_PORT||3306),user:process.env.MYSQL_USER,password:process.env.MYSQL_PASSWORD,database:process.env.MYSQL_DATABASE||"skillsync_review"});
try{const [rows]=await c.query("SELECT COUNT(*) AS total FROM v_career_readiness");console.log("✅ MySQL career scores:",rows[0].total);const [users]=await c.query("SELECT role,COUNT(*) AS total FROM app_users GROUP BY role");console.log("MySQL login accounts:",users);}catch(e){console.error("❌ MySQL verification failed:",e.message);process.exitCode=1}finally{await c.end()}
let mongo;
try{mongo=new MongoClient(process.env.MONGODB_URI,{serverSelectionTimeoutMS:6500});await mongo.connect();const db=mongo.db(process.env.MONGODB_DB||"skillsync_nosql");await db.command({ping:1});console.log("✅ MongoDB Atlas connected; feedback documents:",await db.collection("mentor_feedback").countDocuments())}catch(e){console.error("❌ MongoDB verification failed:",e.message);process.exitCode=1}finally{if(mongo)await mongo.close()}
if(!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length<32){console.error("❌ AUTH_SECRET is missing or too short");process.exitCode=1}else console.log("✅ Auth.js secret present (value not displayed)");
