const Database = require("better-sqlite3");
const db = new Database("mri.db");

function initDB() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS diagnosticos (
      id INTEGER PRIMARY KEY,
      resultado TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `).run();
}

module.exports = { db, initDB };
