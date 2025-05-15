const Database = require('better-sqlite3');

const db = new Database('./db/products.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    imagen TEXT,
    precio REAL NOT NULL,
    rebaja INTEGER NOT NULL DEFAULT 0
  );


  CREATE TABLE IF NOT EXISTS company_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mision TEXT NOT NULL,
    vision TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS integrantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES company_info(id)
      ON DELETE CASCADE
  );
`);

module.exports = db;