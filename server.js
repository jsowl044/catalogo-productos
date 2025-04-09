const express = require('express');
const mongoose = require('mongoose'); // Importar Mongoose
const path = require('path');
const app = express();
const port = 3000;


// --- Configuración de MongoDB ---
mongoose.connect('mongodb+srv://julian44:julian44@catalogo.quslhwi.mongodb.net/catalogo?retryWrites=true&w=majority&appName=catalogo')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware para parsear JSON en las peticiones POST/PUT

// Usar el router de productos
app.use('/api/productos', require('./routes/productosRouter'));

// Ruta para la información de la empresa
app.use('/api/company-info', require('./routes/companyInfoRouter')); 


// --- Iniciar el servidor ---
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
