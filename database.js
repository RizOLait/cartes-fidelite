const Database = require('better-sqlite3');
const db = new Database('fidelite.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    tampons INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function ajouterClient(prenom, email) {
  const stmt = db.prepare('INSERT INTO clients (prenom, email) VALUES (?, ?)');
  return stmt.run(prenom, email);
}

function getClientParEmail(email) {
  return db.prepare('SELECT * FROM clients WHERE email = ?').get(email);
}

function ajouterTampon(email) {
  const stmt = db.prepare('UPDATE clients SET tampons = tampons + 1 WHERE email = ?');
  return stmt.run(email);
}

function tousLesClients() {
  return db.prepare('SELECT * FROM clients').all();
}

module.exports = { ajouterClient, getClientParEmail, ajouterTampon, tousLesClients };