const express = require('express');
const router = express.Router();
const CompanyInfo = require('../models/companyInfo'); // Importar el modelo de CompanyInfo

router.get('/', async (req, res) => {
    try {
        const info = await CompanyInfo.findOne(); // Asumiendo que solo hay un documento de info, o quieres el primero
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener información de la empresa', error: error.message });
    }
});
module.exports = router;