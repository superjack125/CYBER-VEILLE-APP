const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'monitor.db');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(DB_PATH);

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER,
      ip TEXT,
      message TEXT,
      level TEXT
    )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER,
      ip TEXT,
      reason TEXT
    )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      mfa_enabled INTEGER DEFAULT 0,
      mfa_secret TEXT,
      reset_code TEXT
    )`
  );
});

// Helper to create a demo user if not exists
function ensureDemoUser() {
  const username = 'admin';
  const password = 'admin123';
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync(password, 10);
      db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, 'admin']);
    }
  });
}
ensureDemoUser();

module.exports = db;
