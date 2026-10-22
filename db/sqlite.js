const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Ruta de la base de datos: SQLITE_DB_PATH si está definida, o db/products.db por defecto.
// El archivo no se versiona (ver .gitignore): se crea solo la primera vez que arranca la app.
const dbPath = process.env.SQLITE_DB_PATH
  ? path.resolve(process.env.SQLITE_DB_PATH)
  : path.join(__dirname, 'products.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

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

// Datos de ejemplo: solo si las tablas están vacías, para que una instalación nueva
// muestre un catálogo en vez de una página en blanco.
if (db.prepare('SELECT COUNT(*) AS n FROM products').get().n === 0) {
  const insertarProducto = db.prepare(
    'INSERT INTO products (nombre, descripcion, imagen, precio, rebaja) VALUES (?, ?, ?, ?, ?)'
  );
  insertarProducto.run('Smartphone', 'Smartphone ultimo modelo con camara full HD', 'assets/1.jpg', 112, 0);
  insertarProducto.run('Tablet', 'Tablet de 13 pulgadas', 'assets/2.jpg', 83.2, 0);
  insertarProducto.run('Teclado mecanico', 'Teclado con luces RGB especial para juegos', 'assets/3.jpg', 56, 1);
}

if (db.prepare('SELECT COUNT(*) AS n FROM company_info').get().n === 0) {
  const { lastInsertRowid: companyId } = db
    .prepare('INSERT INTO company_info (mision, vision) VALUES (?, ?)')
    .run(
      'Vender productos electronicos de alta calidad, a buenos precios y accesibles para todos nuestros usuarios',
      'Ser una tienda online de confianza y preferida por los usuarios'
    );
  const insertarIntegrante = db.prepare('INSERT INTO integrantes (company_id, nombre, apellido) VALUES (?, ?, ?)');
  insertarIntegrante.run(companyId, 'Julian', 'Agudelo');
  insertarIntegrante.run(companyId, 'Jaziel', 'Garcia');
}

module.exports = db;
