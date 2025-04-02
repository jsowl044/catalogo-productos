const express = require('express');
const app = express();
const port = 4000; // Puedes cambiar el puerto si lo deseas
// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));
// Endpoint API para obtener los productos desde productos.json
app.get('/api/productos', (req, res) => {
const productos = require('./productos.json'); // Cargar el archivo JSON
res.json(productos); // Enviar los productos como respuesta JSON
});

const fs = require('fs');
const path = require('path');

const productosFile = path.join(__dirname, 'productos.json');
app.use(express.json()); // Middleware para leer JSON

// Función para leer productos desde productos.json
const leerProductos = () => {
    try {
        const data = fs.readFileSync(productosFile, 'utf-8');
        console.log('Productos leídos:', JSON.parse(data));
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer productos.json:', error);
        return [];
    }
};

// Función para guardar productos en productos.json
const guardarProductos = (productos) => {
    fs.writeFileSync(productosFile, JSON.stringify(productos, null, 2));
};

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    const productos = leerProductos();
    res.json(productos);
});

// Agregar un nuevo producto
app.post('/api/productos', (req, res) => {
    const productos = leerProductos();
    const nuevoProducto = req.body;
    nuevoProducto.id = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1; // Generar ID único
    productos.push(nuevoProducto);
    guardarProductos(productos);
    res.status(201).json(nuevoProducto);
});

// Editar un producto existente
app.put('/api/productos/:id', (req, res) => {
    const productos = leerProductos();
    const { id } = req.params;
    const index = productos.findIndex(p => p.id == id);

    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    productos[index] = { ...productos[index], ...req.body, id: parseInt(id) };
    guardarProductos(productos);
    res.json(productos[index]);
});

// Eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
    let productos = leerProductos();
    const { id } = req.params;
    const productosFiltrados = productos.filter(p => p.id != id);

    if (productos.length === productosFiltrados.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    guardarProductos(productosFiltrados);
    res.json({ mensaje: 'Producto eliminado' });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});