const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Importar el modelo de Producto


// **Rutas de Productos (CRUD)**

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Product.find(); // Usar el modelo Product para consultar MongoDB
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const producto = new Product(req.body); // Crear una instancia del modelo Product con los datos del cuerpo de la petición
    try {
        const nuevoProducto = await producto.save(); // Guardar en MongoDB
        res.status(201).json(nuevoProducto); // 201 Created
    } catch (error) {
        res.status(400).json({ message: 'Error al crear producto', error: error.message }); // 400 Bad Request
    }
});

// Actualizar un producto (por ID)
router.put('/:id', async (req, res) => {
    try {
        const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, 
        { new: true, runValidators: true }); // { new: true } para retornar el documento actualizado
        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no encontrado' }); // 404 Not Found
        }
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
    }
});

// Eliminar un producto (por ID)
router.delete('/:id', async (req, res) => {
    try {
        const productoEliminado = await Product.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
});
module.exports = router;