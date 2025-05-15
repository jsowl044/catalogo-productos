const express = require('express');
const router = express.Router();
const db = require('../db/postgres');

// Obtener todos los productos
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, nombre, descripcion, imagen, precio, rebaja FROM products ORDER BY id ASC');
    const products = stmt.all().map(product => {
      product.rebaja = product.rebaja === 1 ? true : false; // Convertir rebaja a booleano
      return product;
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

// Crear un nuevo producto
router.post('/', (req, res) => {
  const { nombre, descripcion, imagen, precio, rebaja } = req.body;
  const rebajaParaDB = rebaja ? 1 : 0;
  try {
    const stmt = db.prepare('INSERT INTO products (nombre, descripcion, imagen, precio, rebaja) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(nombre, descripcion, imagen, precio, rebajaParaDB);
    const newProductId = result.lastInsertRowid;
    const newProductStmt = db.prepare('SELECT id, nombre, descripcion, imagen, precio, rebaja FROM products WHERE id = ?');
    const newProduct = newProductStmt.get(newProductId);
    newProduct.rebaja = newProduct.rebaja === 1 ? true : false;
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear producto', error: error.message });
  }
});

// Actualizar un producto por ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen, precio, rebaja } = req.body;
  const rebajaParaDB = rebaja ? 1 : 0; 
  try {
    const stmt = db.prepare(`
      UPDATE products
      SET nombre = ?, descripcion = ?, imagen = ?, precio = ?, rebaja = ?
      WHERE id = ?
    `);
    const result = stmt.run(nombre, descripcion, imagen, precio, rebajaParaDB, id);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const updatedProductStmt = db.prepare('SELECT id, nombre, descripcion, imagen, precio, rebaja FROM products WHERE id = ?');
    const updatedProduct = updatedProductStmt.get(id);
    updatedProduct.rebaja = updatedProduct.rebaja === 1 ? true : false;
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
  }
});

// Eliminar un producto por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
});

module.exports = router;