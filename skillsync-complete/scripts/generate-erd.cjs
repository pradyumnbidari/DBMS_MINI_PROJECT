const mysql = require("mysql2/promise");
const fs = require("node:fs");

async function main() {
  const dbName = process.env.MYSQL_DATABASE || "skillsync_review";
  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: dbName
  });

  try {
    const [tables] = await db.execute(
      `SELECT TABLE_NAME FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
       ORDER BY TABLE_NAME`, [dbName]
    );

    const [columns] = await db.execute(
      `SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_KEY
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ?
       ORDER BY TABLE_NAME, ORDINAL_POSITION`, [dbName]
    );

    const [fks] = await db.execute(
      `SELECT TABLE_NAME, COLUMN_NAME,
              REFERENCED_TABLE_NAME, CONSTRAINT_NAME
       FROM information_schema.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = ?
         AND REFERENCED_TABLE_NAME IS NOT NULL`, [dbName]
    );

    const fkColumns = new Set(
      fks.map(f => f.TABLE_NAME + "." + f.COLUMN_NAME)
    );

    const lines = ["erDiagram"];

    for (const table of tables) {
      lines.push("    " + table.TABLE_NAME + " {");

      for (const col of columns.filter(
        c => c.TABLE_NAME === table.TABLE_NAME
      )) {
        const keys = [];

        if (col.COLUMN_KEY === "PRI") keys.push("PK");
        if (fkColumns.has(col.TABLE_NAME + "." + col.COLUMN_NAME))
          keys.push("FK");
        if (col.COLUMN_KEY === "UNI") keys.push("UK");

        lines.push(
          `        ${col.DATA_TYPE} ${col.COLUMN_NAME}` +
          (keys.length ? " " + keys.join(",") : "")
        );
      }

      lines.push("    }");
    }

    const seen = new Set();

    for (const fk of fks) {
      const key = fk.TABLE_NAME + "." + fk.CONSTRAINT_NAME;
      if (seen.has(key)) continue;
      seen.add(key);

      lines.push(
        `    ${fk.REFERENCED_TABLE_NAME} ||--o{ ${fk.TABLE_NAME} : references`
      );
    }

    fs.mkdirSync("docs", { recursive: true });
    fs.writeFileSync(
      "docs/SkillSync_Final_ER_Diagram.mmd",
      lines.join("\n") + "\n"
    );

    console.log("SUCCESS: Final ER diagram source created");
    console.log("Total tables:", tables.length);
    console.log("Foreign key constraints:", seen.size);
  } finally {
    await db.end();
  }
}

main().catch(e => {
  console.error(e.message);
  process.exitCode = 1;
});
