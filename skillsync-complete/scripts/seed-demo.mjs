// SkillSync: non-destructive, repeatable FICTIONAL demo data seeder.
// Run: node --env-file=.env.local scripts/seed-demo.mjs
import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';

const db = await mysql.createConnection({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'skillsync_review',
});

const students = [
  ['Aarav Shetty', 'aarav.demo@example.com', 'AIML'],
  ['Meera Nair', 'meera.demo@example.com', 'CSE'],
  ['Nisha Reddy', 'nisha.demo@example.com', 'AIML'],
  ['Rohan Kulkarni', 'rohan.demo@example.com', 'CSE'],
  ['Sneha Rao', 'sneha.demo@example.com', 'AIML'],
  ['Kavya Menon', 'kavya.demo@example.com', 'CSE'],
  ['Ishaan Malhotra', 'ishaan.demo@example.com', 'AIML'],
  ['Dev Patel', 'dev.demo@example.com', 'CSE'],
];
const newSkills = [
  ['Deep Learning', 22], ['Docker', 12], ['Git', 8], ['Linux', 12],
  ['Pandas', 12], ['NLP', 20], ['PyTorch', 18], ['Data Visualization', 10],
  ['Cybersecurity', 20], ['JavaScript', 12], ['Computer Vision', 20],
  ['AWS', 18], ['Apache Spark', 20], ['FastAPI', 12], ['Network Security', 18],
];
const newCareers = [
  'Data Scientist', 'NLP Engineer', 'Cybersecurity Analyst',
  'DevOps Engineer', 'Backend Developer', 'Computer Vision Engineer',
  'Cloud Engineer',
];
// [career, skill, required level, importance] (1 to 5)
const requirements = [
  ['Data Scientist', 'Python', 4, 5], ['Data Scientist', 'SQL', 3, 4],
  ['Data Scientist', 'Statistics', 4, 5], ['Data Scientist', 'Machine Learning', 4, 5],
  ['Data Scientist', 'Pandas', 4, 4], ['Data Scientist', 'Data Visualization', 3, 3],
  ['NLP Engineer', 'Python', 4, 5], ['NLP Engineer', 'Machine Learning', 4, 4],
  ['NLP Engineer', 'NLP', 4, 5], ['NLP Engineer', 'Deep Learning', 4, 5],
  ['NLP Engineer', 'PyTorch', 3, 4], ['NLP Engineer', 'Git', 3, 2],
  ['Cybersecurity Analyst', 'Cybersecurity', 4, 5], ['Cybersecurity Analyst', 'Linux', 4, 5],
  ['Cybersecurity Analyst', 'Network Security', 4, 5], ['Cybersecurity Analyst', 'Python', 3, 3],
  ['Cybersecurity Analyst', 'SQL', 2, 2], ['Cybersecurity Analyst', 'Git', 2, 2],
  ['DevOps Engineer', 'Linux', 4, 5], ['DevOps Engineer', 'Docker', 4, 5],
  ['DevOps Engineer', 'AWS', 4, 5], ['DevOps Engineer', 'Git', 4, 4],
  ['DevOps Engineer', 'Python', 3, 3], ['DevOps Engineer', 'Cloud', 4, 4],
  ['Backend Developer', 'Node.js', 4, 5], ['Backend Developer', 'JavaScript', 4, 5],
  ['Backend Developer', 'SQL', 4, 5], ['Backend Developer', 'Git', 3, 3],
  ['Backend Developer', 'Docker', 3, 3], ['Backend Developer', 'DSA', 3, 4],
  ['Computer Vision Engineer', 'Python', 4, 5], ['Computer Vision Engineer', 'Computer Vision', 4, 5],
  ['Computer Vision Engineer', 'Deep Learning', 4, 5], ['Computer Vision Engineer', 'PyTorch', 4, 4],
  ['Computer Vision Engineer', 'Machine Learning', 4, 4], ['Computer Vision Engineer', 'Git', 3, 2],
  ['Cloud Engineer', 'AWS', 4, 5], ['Cloud Engineer', 'Cloud', 4, 5],
  ['Cloud Engineer', 'Linux', 4, 4], ['Cloud Engineer', 'Docker', 3, 4],
  ['Cloud Engineer', 'Python', 3, 3], ['Cloud Engineer', 'Network Security', 3, 3],
];
// [student, skill, self-reported proficiency 1-5]
const profiles = [
  ['Aarav Shetty', 'Python', 4], ['Aarav Shetty', 'Machine Learning', 3],
  ['Aarav Shetty', 'Deep Learning', 2], ['Aarav Shetty', 'SQL', 3],
  ['Aarav Shetty', 'Git', 3], ['Aarav Shetty', 'Computer Vision', 2],
  ['Meera Nair', 'Python', 4], ['Meera Nair', 'SQL', 4],
  ['Meera Nair', 'Pandas', 4], ['Meera Nair', 'Statistics', 3],
  ['Meera Nair', 'Data Visualization', 4], ['Meera Nair', 'Git', 3],
  ['Nisha Reddy', 'Python', 4], ['Nisha Reddy', 'Machine Learning', 3],
  ['Nisha Reddy', 'NLP', 3], ['Nisha Reddy', 'Deep Learning', 2],
  ['Nisha Reddy', 'PyTorch', 2], ['Nisha Reddy', 'SQL', 3],
  ['Rohan Kulkarni', 'Node.js', 4], ['Rohan Kulkarni', 'JavaScript', 4],
  ['Rohan Kulkarni', 'SQL', 3], ['Rohan Kulkarni', 'Git', 4],
  ['Rohan Kulkarni', 'Docker', 2], ['Rohan Kulkarni', 'DSA', 3],
  ['Sneha Rao', 'Python', 3], ['Sneha Rao', 'SQL', 4],
  ['Sneha Rao', 'Power BI', 4], ['Sneha Rao', 'Statistics', 3],
  ['Sneha Rao', 'Pandas', 3], ['Sneha Rao', 'Data Visualization', 4],
  ['Kavya Menon', 'Linux', 4], ['Kavya Menon', 'Docker', 3],
  ['Kavya Menon', 'AWS', 3], ['Kavya Menon', 'Git', 4],
  ['Kavya Menon', 'Cloud', 3], ['Kavya Menon', 'Python', 2],
  ['Ishaan Malhotra', 'Python', 4], ['Ishaan Malhotra', 'Computer Vision', 3],
  ['Ishaan Malhotra', 'Deep Learning', 3], ['Ishaan Malhotra', 'PyTorch', 3],
  ['Ishaan Malhotra', 'Machine Learning', 4], ['Ishaan Malhotra', 'Git', 3],
  ['Dev Patel', 'Cybersecurity', 3], ['Dev Patel', 'Linux', 4],
  ['Dev Patel', 'Network Security', 3], ['Dev Patel', 'Python', 3],
  ['Dev Patel', 'Git', 3], ['Dev Patel', 'SQL', 2],
];
const projects = [
  ['Prathyush Gowda', 'AI Resume Screening System', 'NLP'],
  ['Prathyush Gowda', 'Movie Recommendation System', 'Machine Learning'],
  ['Ananya Rao', 'Campus Event Booking Portal', 'Full Stack'],
  ['Rahul Verma', 'Retail Sales Insights', 'Data Analytics'],
  ['Aarav Shetty', 'Plant Disease Detection', 'Computer Vision'],
  ['Aarav Shetty', 'House Price Prediction', 'Machine Learning'],
  ['Meera Nair', 'Customer Churn Prediction', 'Data Science'],
  ['Meera Nair', 'Retail Demand Forecasting', 'Statistics'],
  ['Nisha Reddy', 'Fake News Detection', 'NLP'],
  ['Nisha Reddy', 'Multilingual Sentiment Analysis', 'NLP'],
  ['Rohan Kulkarni', 'Inventory Management REST API', 'Backend Development'],
  ['Rohan Kulkarni', 'Hostel Complaint Tracking Portal', 'Web Development'],
  ['Sneha Rao', 'Student Placement Prediction', 'Data Science'],
  ['Sneha Rao', 'E-commerce Analytics Dashboard', 'Data Analytics'],
  ['Kavya Menon', 'Dockerized Deployment Pipeline', 'DevOps'],
  ['Kavya Menon', 'Cloud Cost Tracker', 'Cloud Computing'],
  ['Ishaan Malhotra', 'Smart Attendance using Face Recognition', 'Computer Vision'],
  ['Ishaan Malhotra', 'Traffic Sign Classification', 'Deep Learning'],
  ['Dev Patel', 'Network Log Anomaly Detector', 'Cybersecurity'],
  ['Dev Patel', 'Secure Password Audit Tool', 'Security'],
];
// DEMO certificate records, not claims of real qualifications.
const certificates = [
  ['Prathyush Gowda', '[DEMO] Python Programming Fundamentals'],
  ['Prathyush Gowda', '[DEMO] Introduction to Machine Learning'],
  ['Ananya Rao', '[DEMO] Web Development Basics'],
  ['Rahul Verma', '[DEMO] SQL for Data Analysis'],
  ['Aarav Shetty', '[DEMO] Machine Learning Foundations'],
  ['Meera Nair', '[DEMO] Applied Data Analytics'],
  ['Nisha Reddy', '[DEMO] Natural Language Processing'],
  ['Rohan Kulkarni', '[DEMO] Backend APIs with Node.js'],
  ['Sneha Rao', '[DEMO] Data Visualization Fundamentals'],
  ['Kavya Menon', '[DEMO] Docker and Linux Basics'],
  ['Ishaan Malhotra', '[DEMO] Deep Learning Essentials'],
  ['Dev Patel', '[DEMO] Cybersecurity Basics'],
];

function num(x) { return Number(x); }
async function allIds(table, keyName, idName) {
  const [rows] = await db.query(`SELECT ${idName} AS id, ${keyName} AS label FROM ${table}`);
  return new Map(rows.map(r => [r.label, num(r.id)]));
}

let ids, skills, careers;
try {
  await db.beginTransaction();
  for (const [name, email, branch] of students) {
    await db.execute('INSERT IGNORE INTO students (full_name,email,branch) VALUES (?,?,?)', [name,email,branch]);
  }
  for (const [name, hours] of newSkills) {
    await db.execute('INSERT IGNORE INTO skills (skill_name,hours_per_level) VALUES (?,?)', [name,hours]);
  }
  for (const name of newCareers) {
    await db.execute('INSERT IGNORE INTO careers (career_name) VALUES (?)', [name]);
  }
  ids = await allIds('students', 'full_name', 'student_id');
  skills = await allIds('skills', 'skill_name', 'skill_id');
  careers = await allIds('careers', 'career_name', 'career_id');

  for (const [career, skill, level, importance] of requirements) {
    await db.execute('INSERT IGNORE INTO career_skills (career_id,skill_id,required_level,importance) VALUES (?,?,?,?)',
      [careers.get(career),skills.get(skill),level,importance]);
  }
  for (const [student, skill, level] of profiles) {
    await db.execute('INSERT IGNORE INTO student_skills (student_id,skill_id,proficiency) VALUES (?,?,?)',
      [ids.get(student),skills.get(skill),level]);
  }
  for (const [student, title, area] of projects) {
    await db.execute(`INSERT INTO projects(student_id,project_title,project_area)
      SELECT ?,?,? WHERE NOT EXISTS
      (SELECT 1 FROM projects WHERE student_id=? AND project_title=?)`,
      [ids.get(student),title,area,ids.get(student),title]);
  }
  for (const [student,title] of certificates) {
    await db.execute(`INSERT INTO certifications(student_id,title,issuer,issued_at)
      SELECT ?,?,'SkillSync Demo Academy',CURRENT_DATE()
      WHERE NOT EXISTS(SELECT 1 FROM certifications WHERE student_id=? AND title=?)`,
      [ids.get(student),title,ids.get(student),title]);
  }
  for (const [student, skill] of [
    ['Prathyush Gowda','Python'],['Prathyush Gowda','Machine Learning'],
    ['Ananya Rao','React'],['Rahul Verma','SQL'],
    ['Aarav Shetty','Python'],['Meera Nair','Pandas'],['Nisha Reddy','NLP'],
    ['Rohan Kulkarni','Node.js'],['Sneha Rao','Power BI'],
    ['Kavya Menon','Docker'],['Ishaan Malhotra','Computer Vision'],['Dev Patel','Linux'],
  ]) {
    const note = '[DEMO] Weekly study session for ' + skill;
    await db.execute(`INSERT INTO learning_progress (student_id,skill_id,hours,note)
      SELECT ?,?,4.0,? WHERE NOT EXISTS
      (SELECT 1 FROM learning_progress WHERE student_id=? AND skill_id=? AND note=?)`,
      [ids.get(student),skills.get(skill),note,ids.get(student),skills.get(skill),note]);
  }
  await db.commit();
} catch(e) {
  await db.rollback();
  console.error('MySQL seed failed; transaction rolled back:',e.message);
  process.exitCode = 1;
  await db.end();
  process.exit();
}

try {
  const [records] = await db.query('SELECT student_id, career_id, readiness_percent, estimated_learning_hours FROM v_career_readiness ORDER BY student_id, readiness_percent DESC');
  const stored = new Set();
  for (const r of records) {
    const sid=num(r.student_id);
    const count=stored.has(sid) ? 1 : 0;
    if (count) continue;
    const [existing] = await db.execute('SELECT 1 FROM recommendation_history WHERE student_id=? LIMIT 1',[sid]);
    if (!existing.length) {
      await db.execute('INSERT INTO recommendation_history(student_id,career_id,readiness_percent,estimated_learning_hours) VALUES (?,?,?,?)',
        [sid,num(r.career_id),num(r.readiness_percent),num(r.estimated_learning_hours)]);
    }
    stored.add(sid);
  }
  const [c] = await db.query(`SELECT
    (SELECT COUNT(*) FROM students) students,
    (SELECT COUNT(*) FROM skills) skills,
    (SELECT COUNT(*) FROM careers) careers,
    (SELECT COUNT(*) FROM projects) projects,
    (SELECT COUNT(*) FROM certifications) certifications,
    (SELECT COUNT(*) FROM v_career_readiness) readiness_rows`);
  console.log('MySQL demo data added:',c[0]);
} finally {
  await db.end();
}

if (process.env.MONGODB_URI) {
  let mongo;
  try {
    mongo = new MongoClient(process.env.MONGODB_URI,{serverSelectionTimeoutMS:12000,family:4});
    await mongo.connect();
    const collection=mongo.db(process.env.MONGODB_DB||'skillsync_nosql').collection('mentor_feedback');
    const cases = [
      ['Aarav Shetty','Computer Vision Engineer','Computer Vision','Deep Learning'],
      ['Meera Nair','Data Scientist','Statistics','Machine Learning'],
      ['Nisha Reddy','NLP Engineer','NLP','PyTorch'],
      ['Rohan Kulkarni','Backend Developer','Docker','SQL'],
      ['Sneha Rao','Data Analyst','Statistics','Python'],
      ['Kavya Menon','DevOps Engineer','AWS','Docker'],
      ['Ishaan Malhotra','Computer Vision Engineer','PyTorch','Deep Learning'],
      ['Dev Patel','Cybersecurity Analyst','Network Security','Cybersecurity'],
    ];
    for (const [student,career,high,medium] of cases) {
      await collection.updateOne({student_id:ids.get(student)},{$setOnInsert:{
        student_id:ids.get(student),student_name:student,career_goal:career,
        mentor_name:'SkillSync Demo Mentor',
        feedback:`[DEMO] Practice ${high} and ${medium}; complete one portfolio project.`,
        recommended_skills:[{skill:high,priority:'High'},{skill:medium,priority:'Medium'}],
        progress:{status:'Demo record',completion_percentage:25},
        is_demo:true,created_at:new Date(),
      }},{upsert:true});
    }
    console.log('MongoDB demo feedback documents:',await collection.countDocuments());
  } catch (e) {
    console.error('MongoDB seed skipped (existing data untouched):', e.message);
    process.exitCode=1;
  } finally { if (mongo) await mongo.close(); }
}
console.log('DONE. All added records are fictional demo data. Existing data was not deleted.');
