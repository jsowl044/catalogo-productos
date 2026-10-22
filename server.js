require('dotenv').config({ quiet: true });
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// --- Conexión MongoDB (opcional) ---
// La cadena de conexión se lee de la variable MONGO_URI (archivo .env, ver .env.example):
// nunca se escribe en el código. Hoy los productos y la información de la empresa viven en
// SQLite (db/sqlite.js), así que la API funciona aunque MONGO_URI no esté definida.
if (process.env.MONGO_URI) {
    const mongoose = require('mongoose');
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Conectado a MongoDB'))
        .catch(err => console.error('Error de conexión a MongoDB:', err.message));
} else {
    console.log('MONGO_URI no está definida: se omite la conexión a MongoDB.');
}

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rutas
app.use('/api/productos', require('./routes/productosRouter'));
app.use('/api/company-info', require('./routes/companyInfoRouter'));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
