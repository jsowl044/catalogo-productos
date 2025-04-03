const express = require('express');
const app = express();
const port = 4000; // Puedes cambiar el puerto si lo deseas
const fs = require('fs');
const path = require('path');

const productosFile = path.join(__dirname, 'productos.json');

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));
app.use(express.json()); // Middleware para leer JSON

// Función para leer productos desde productos.json
const leerProductos = () => {
    try {
        const data = fs.readFileSync(productosFile, 'utf-8');
        console.log(data);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer productos.json:', error);
        return [];
    }
};
// Desactivar cache
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Función para guardar productos en productos.json
const guardarProductos = (productos) => {
    fs.writeFile(productosFile, JSON.stringify(productos, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar productos.json:', err);
        }
    });
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
    const productosFiltrados = productos.filter(p => String(p.id) != String(id));
    if (productos.length === productosFiltrados.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    console.log(productosFiltrados);
    fs.writeFileSync(productosFile, JSON.stringify(productosFiltrados, null, 2));
    res.json({ mensaje: 'Producto eliminado' });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});