const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("node:crypto");

const mentors = [
  ["Dr. Arjun Rao", "arjun.mentor@example.com", "Aarav Shetty"],
  ["Prof. Neha Sharma", "neha.mentor@example.com", "Meera Nair"],
  ["Dr. Kiran Kumar", "kiran.mentor@example.com", "Nisha Reddy"],
  ["Prof. Priya Nair", "priya.mentor@example.com", "Rohan Kulkarni"]
];

(async () => {
  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || "skillsync_review"
  });

  const results = [];

  try {
    await db.beginTransaction();

    for (const [name, email, studentName] of mentors) {
      const [students] = await db.execute(
        "SELECT student_id FROM students WHERE full_name = ? LIMIT 1",
        [studentName]
      );

      if (!students.length) {
        throw new Error("Student not found: " + studentName);
      }

      const [existing] = await db.execute(
        "SELECT user_id, role FROM app_users WHERE email = ?",
        [email]
      );

      let userId;
      let loginPassword = "(existing password unchanged)";

      if (existing.length) {
        if (existing[0].role !== "mentor") {
          throw new Error("Email belongs to another role: " + email);
        }
        userId = existing[0].user_id;
      } else {
        loginPassword = randomBytes(18).toString("base64url");
        const hash = await bcrypt.hash(loginPassword, 12);

        const [result] = await db.execute(
          `INSERT INTO app_users
           (full_name, email, password_hash, role, student_id)
           VALUES (?, ?, ?, 'mentor', NULL)`,
          [name, email, hash]
        );

        userId = result.insertId;
      }

      await db.execute(
        `INSERT IGNORE INTO mentor_assignments
         (mentor_user_id, student_id) VALUES (?, ?)`,
        [userId, students[0].student_id]
      );

      results.push({ name, email, loginPassword, studentName });
    }

    await db.commit();

    console.log("\nMENTOR ACCOUNTS AND ASSIGNMENTS\n");

    for (const m of results) {
      console.log("Mentor:", m.name);
      console.log("Email:", m.email);
      console.log("Password:", m.loginPassword);
      console.log("Student:", m.studentName);
      console.log("-----------------------------");
    }

    console.log("SUCCESS: All mentor assignments saved.");
    console.log("Save new passwords privately. They are shown only once.");

  } catch (error) {
    await db.rollback();
    console.error("ERROR:", error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
