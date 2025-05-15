const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;

// --- Conexión MongoDB ---
mongoose.connect('mongodb+srv://julian44:julian44@catalogo.quslhwi.mongodb.net/catalogo?retryWrites=true&w=majority&appName=catalogo')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

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