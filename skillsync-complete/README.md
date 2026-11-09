# SkillSync — Complete DBMS Web Project

Next.js 16 + React 19 + TypeScript + MySQL 8 + MongoDB Atlas + Auth.js (Credentials/JWT).

This is a **new, complete project folder**, reconstructed from the chat and original six-table MySQL review scripts. It is **not a byte-for-byte copy of your existing laptop folder**. It deliberately **reuses the same existing MySQL (`skillsync_review`) and MongoDB (`skillsync_nosql`) data and login accounts**.

## Windows CMD: quickest setup (preserves your work)

1. Extract the ZIP into `D:\5TH SEM\DBMS\Mini project\` so the new folder is `D:\5TH SEM\DBMS\Mini project\skillsync-complete` alongside your existing `skillsync-app` folder.
2. Open CMD and run:

```bat
cd /d "D:\5TH SEM\DBMS\Mini project\skillsync-complete"
copy "..\skillsync-app\.env.local" ".env.local"
npm install
npm run setup:db
npm run verify
npm run dev
```

3. Or run `START_SKILLSYNC.cmd` from CMD after extraction to perform these steps automatically. Open `http://localhost:3000`. Log in using the existing account you already created. The old Next.js server must be stopped (Ctrl+C) first to free port 3000.

### If your original folder is in a different location

Copy your working `.env.local` into this new `skillsync-complete` folder manually. **Do not upload this file or share its contents**. If it isn't available, use `.env.example` as a guide, populate secrets locally, then run `npm run setup:db`.

### Need additional logins or mentor assignments?

```bat
npm run create:user
npm run assign:mentor
```

Do not run any old review setup scripts labeled RESET or DROP. `npm run setup:db` is **non-destructive**: checks for all six core tables, creates new application tables, views, triggers and stored routines only if absent, and preserves existing records. It cannot automatically undo errors made outside these scripts; back up important data first.

## What is included

- Student: login, editable profile, dashboard using `v_career_readiness`, edit own skills, gap priorities, projects, certifications, learning-hour tracking, score history, and MongoDB mentor feedback.
- Mentor: sign in, view *assigned* students, create/update MongoDB feedback. Admin assigns mentors via UI or CLI.
- Admin: reports (JOIN, GROUP BY, AVG, COUNT), login account directory (excluding password hashes), mentor assignment UI, career required-level/importance editing with transactions and audit.
- API authorization: permissions checked on the server for all pages and APIs; students cannot change other student IDs. Unauthenticated requests receive 401; unassigned mentors receive 403.
- MySQL: six original core tables retained, plus `app_users`, `mentor_assignments`, `certifications`, `learning_progress`, `recommendation_history`, and `audit_logs` (12 total if all created), alongside SQL views, indexes and example routines/triggers.
- MongoDB: reuses `mentor_feedback` from `skillsync_nosql`, mapping old name-based document to student ID on first authenticated mentor update.
- `sql/advanced_demos.sql`: DBMS commands to demonstrate triggers, functions, procedure, and analytical reports.
- `docs/Original_Six_Table_ER_Diagram.png`: original core DB diagram. Newly added tables are described in the extended schema notes below.

## Final demonstration

1. Login Student -> Dashboard -> Skill Gaps -> My Skills -> Profile -> History; update Python level, return to Dashboard to verify changed readiness, restore level.
2. Add a Project, a Certification, and log Learning Progress.
3. Login Mentor -> Mentor Workspace -> choose an assigned student -> edit feedback -> save. Sign in as Student to read it.
4. Login Admin -> show Users, reports, mentor assignments, update a requirement.
5. In MySQL Client, run `source D:/5TH SEM/DBMS/Mini project/skillsync-complete/sql/advanced_demos.sql` or copy commands individually. If optional stored routines could not be created due to permissions, omit the procedure/function commands until privileges are fixed.

## Schema notes (additional to six original)

- `app_users.student_id` -> `students.student_id` (one-to-one optional; unique)
- `mentor_assignments.mentor_user_id` -> `app_users.user_id`; `.student_id` -> `students.student_id`
- `certifications.student_id`, `learning_progress.student_id`, `recommendation_history.student_id` -> students
- `learning_progress.skill_id` -> skills; `recommendation_history.career_id` -> careers
- `audit_logs.actor_user_id` -> app_users (nullable); DB triggers record skill-level changes without user ID
- MongoDB `mentor_feedback` document has student_id, student_name, mentor_name, feedback and nested recommended_skills, with legacy student-name lookup supported.

## Remaining limitations / correct claims

- This is a runnable **academic prototype**, not a production-ready deployed service. Password reset, multi-factor authentication, durable rate limiting, CSRF/security testing, backup/restore and full performance testing are not included.
- Sample profiles, career requirements, weights, and learning-hour assumptions are illustrative. Recommendation is a **weighted rule-based SQL algorithm**, not trained ML or semantic vector embeddings. The original PostgreSQL/pgvector proposal requires updating if your teacher expects semantic search.
- Your existing MongoDB progress object is a saved historical mentor note, not synchronized with MySQL learning-hour entries.
- No shared files/credentials from your laptop were included in this ZIP. Using your local `.env.local` preserves database access; copy only on your own computer.
- Never publish `.env.local` to GitHub. Do not deploy this project publicly before a production security review.

## Troubleshooting

- 404: check `app/api/auth/[...nextauth]/route.ts` and run `npm run dev` in the new project directory.
- MissingSecret: copy `AUTH_SECRET` from old `.env.local`, or generate a new value using `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"` and save it in `.env.local`.
- MySQL connection error: confirm MySQL service is running, correct host, username/password, and database name.
- MongoDB auth error: confirm database-user password, valid URI-encoding, IP allowlist, and cluster access.
- Port in use: stop old `npm run dev` with Ctrl+C. `npm run dev` should report localhost:3000.
- Developer server warnings are not necessarily failures; run `npm run check` for TypeScript checking and `npm run build` to test production compilation.
