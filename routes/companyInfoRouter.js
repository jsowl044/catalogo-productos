const express = require('express');
const router = express.Router();
const CompanyInfo = require('../models/companyInfo');

// Obtener la información de la empresa
router.get('/', async (req, res) => {
    try {
        const info = await CompanyInfo.findOne(); // Solo hay un documento
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener información de la empresa', error: error.message });
    }
});

// Crear o actualizar la información de la empresa
router.post('/', async (req, res) => {
    const { mision, vision, integrantes } = req.body;

    try {
        let info = await CompanyInfo.findOne();

        if (info) {
            // Actualizar
            info.mision = mision;
            info.vision = vision;
            info.integrantes = integrantes;
            await info.save();
            res.json({ message: 'Información actualizada correctamente', info });
        } else {
            // Crear nueva
            info = new CompanyInfo({ mision, vision, integrantes });
            await info.save();
            res.status(201).json({ message: 'Información creada correctamente', info });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar información', error: error.message });
    }
});

module.exports = router;