const express = require('express');
const router = express.Router();
const db = require('../db/postgres');

// Obtener la información de la empresa
router.get('/', (req, res) => {
  try {
    const companyStmt = db.prepare('SELECT id, mision, vision FROM company_info LIMIT 1');
    const companyResult = companyStmt.get();

    if (!companyResult) {
      return res.json(null);
    }

    const integrantesStmt = db.prepare('SELECT nombre, apellido FROM integrantes WHERE company_id = ?');
    const integrantesResult = integrantesStmt.all(companyResult.id);

    companyResult.integrantes = integrantesResult;
    res.json(companyResult);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener información de la empresa', error: error.message });
  }
});

// Crear o actualizar la información de la empresa
router.post('/', (req, res) => {
  const { mision, vision, integrantes } = req.body;

  try {
    // Borrar datos existentes (asumiendo 1 sola empresa)
    db.prepare('DELETE FROM integrantes').run();
    db.prepare('DELETE FROM company_info').run();

    // Insertar nueva empresa
    const insertCompanyStmt = db.prepare('INSERT INTO company_info (mision, vision) VALUES (?, ?)');
    const insertCompanyResult = insertCompanyStmt.run(mision, vision);
    const companyId = insertCompanyResult.lastInsertRowid;

    // Insertar integrantes
    const insertIntegranteStmt = db.prepare('INSERT INTO integrantes (company_id, nombre, apellido) VALUES (?, ?, ?)');
    for (const integrante of integrantes) {
      insertIntegranteStmt.run(companyId, integrante.nombre, integrante.apellido);
    }

    res.status(201).json({ message: 'Información de la empresa guardada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar información de la empresa', error: error.message });
  }
});

module.exports = router;