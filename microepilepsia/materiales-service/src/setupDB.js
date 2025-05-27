const Database = require("better-sqlite3");
const db = new Database("materiales.db");

function initDB() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS materiales (
      id INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL,
      disponible INTEGER DEFAULT 1
    )
  `).run();

  const count = db.prepare("SELECT COUNT(*) AS total FROM materiales").get().total;
  if (count === 0) {
    const insert = db.prepare("INSERT INTO materiales (nombre) VALUES (?)");
    for (let i = 1; i <= 20; i++) {
      insert.run(`Material ${i}`);
    }
  }
}

module.exports = { db, initDB };
