document.addEventListener('DOMContentLoaded', () => {
    const formProducto = document.getElementById('form-producto');
    const inputProductoId = document.getElementById('producto-id');
    const inputNombre = document.getElementById('nombre');
    const inputDescripcion = document.getElementById('descripcion');
    const inputPrecio = document.getElementById('precio');
    const inputImagen = document.getElementById('imagen');
    const previewImagenDiv = document.getElementById('preview-imagen');
    const listaProductosDiv = document.getElementById('lista-productos');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnCancelar = document.getElementById('btn-cancelar');
    let productos = [];
    inputImagen.addEventListener('change', function() {
        previewImagenDiv.innerHTML = ''; // Limpiar vista previa anterior
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Vista previa de la imagen';
                previewImagenDiv.appendChild(img);
            }
            reader.readAsDataURL(this.files[0]); // Lee el archivo como URL de datos (Base64)
        }
    });
    // Manejar el evento de envío del formulario
    formProducto.addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const productoId = inputProductoId.value;
        const nombre = inputNombre.value;
        const descripcion = inputDescripcion.value;
        const precio = parseFloat(inputPrecio.value);
        const imagenFile = inputImagen.files[0];
        let imagenBase64 = null;
    
        // Validación de los campos
        if (!nombre) {
            alert('Por favor, ingrese un nombre para el producto.');
            return;
        }
        if (!descripcion) {
            alert('Por favor, ingrese una descripción para el producto.');
            return;
        }
        if (isNaN(precio) || precio < 0) {
            alert('Por favor, ingrese un precio válido (mayor o igual a 0).');
            return;
        }
    
        // Manejo de la imagen
        if (imagenFile) {
            const reader = new FileReader();
            reader.onloadend = async function () {
                imagenBase64 = reader.result;
                await procesarProducto(productoId,imagenBase64);
            };
            reader.readAsDataURL(imagenFile);
        } else {
            imagenBase64 = null; // No hay imagen seleccionada
            await procesarProducto(productoId, imagenBase64);
        }
    });
    
    // Función para procesar el producto
    async function procesarProducto(productoId, imagenBase64) {
        const nuevoProducto = {
            id: productoId ? productoId : undefined, // Usar ID existente si es edición, sino dejar que el servidor lo genere
            nombre: inputNombre.value.trim(), // Obtener el valor del campo
            descripcion: inputDescripcion.value.trim(), // Obtener el valor del campo
            precio: parseFloat(inputPrecio.value), // Convertir el precio a número
            imagen: imagenBase64, // Base64 de la imagen
        };
        if (!productoId) {
            delete nuevoProducto.id;
        }
    
        await guardarProducto(nuevoProducto);
        cargarProductos();
        mostrarProductos();
        formProducto.reset();
        previewImagenDiv.innerHTML = '';
        inputProductoId.value = '';
        btnCancelar.style.display = 'none';
        btnGuardar.textContent = 'Guardar Producto';
    }

    btnCancelar.addEventListener('click', function() {
        formProducto.reset();
        previewImagenDiv.innerHTML = '';
        inputProductoId.value = '';
        btnCancelar.style.display = 'none';
        btnGuardar.textContent = 'Guardar Producto';
    });
    
    async function cargarProductos() {
        try {
            const respuesta = await fetch('/api/productos'); // Ruta del servidor Express
            if (!respuesta.ok) {
                throw new Error('Error al cargar los productos');
            }
            productos = await respuesta.json(); // Convertir la respuesta a JSON
            mostrarProductos(); // Mostrar los productos en la página
        } catch (error) {
            console.error(error);
        }   
    } 
    async function guardarProducto(producto) {
        try {
            const metodo = producto.id ? 'PUT' : 'POST'; // Usar PUT si el producto tiene ID, POST si es nuevo
            const url = producto.id
                ? `/api/productos/${producto.id}` // Ruta para actualizar un producto existente
                : '/api/productos'; // Ruta para agregar un nuevo producto
            const respuesta = await fetch(url, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(producto),
            });
            if (!respuesta.ok) {
                throw new Error('Error al guardar el producto');
            }
        } catch (error) {
            console.error(error);
        }
    }
    function mostrarProductos() {
        listaProductosDiv.innerHTML = '';
        console.log(productos.length); // Para depuración
        if (productos.length === 0) {
            listaProductosDiv.innerHTML = '<p>No hay productos en el catálogo.</p>';
            return;
        }
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto-item');
            const imagenElemento = document.createElement('img');
            
            imagenElemento.src = producto.imagen || 'img/default-producto.png'; // Imagen por defecto si no hay imagen
            
            imagenElemento.alt = producto.nombre;
            imagenElemento.classList.add('producto-imagen');
            const detallesDiv = document.createElement('div');
            detallesDiv.classList.add('producto-detalles');
            detallesDiv.innerHTML = `
            <h3 class="producto-nombre">${producto.nombre}</h3>
            
            <p class="producto-
            descripcion">${producto.descripcion}</p>
            
            <p class="producto-precio">Precio:
            $${producto.precio.toFixed(2)}</p>
            `;
            const accionesDiv = document.createElement('div');
            accionesDiv.classList.add('producto-acciones');
            accionesDiv.innerHTML = `
            
            <button class="editar" data-id="${producto.id}">Editar</button>
            
            <button class="eliminar" data-id="${producto.id}">Eliminar</button>`;
            
            accionesDiv.querySelector('.editar').addEventListener('click', () =>
            editarProducto(producto.id));
            
            accionesDiv.querySelector('.eliminar').addEventListener('click', () =>
            eliminarProducto(producto.id));
            productoDiv.appendChild(imagenElemento);
            productoDiv.appendChild(detallesDiv);
            productoDiv.appendChild(accionesDiv);
            listaProductosDiv.appendChild(productoDiv);
        });
    }
    function obtenerProducto(id) {
        return productos.find(producto => producto.id === id);
    }
    function editarProducto(id) {
        const producto = obtenerProducto(id);
        if (producto) {
            inputProductoId.value = producto.id;
            inputNombre.value = producto.nombre;
            inputDescripcion.value = producto.descripcion;
            inputPrecio.value = producto.precio;
            if (producto.imagen && producto.imagen.startsWith('data:image')) { // Si es Base64, mostrar en preview
                previewImagenDiv.innerHTML = `<img src="${producto.imagen}" alt="Imagen actual del producto">`;
            } else {
                previewImagenDiv.innerHTML = ''; // Limpiar si no es Base64 o no hay imagen y se va a editar
            }
            btnGuardar.textContent = 'Actualizar Producto';
            btnCancelar.style.display = 'inline-block'; // Mostrar botón cancelar
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Opcional: scroll al formulario
        }
    }
    async function eliminarProducto(id) {
        try {
            const respuesta = await fetch(`/api/productos/${id}`, {
                method: 'DELETE',
            });
    
            if (!respuesta.ok) {
                throw new Error('Error al eliminar el producto');
            }
        } catch (error) {
            console.error(error);
        }
    }
    cargarProductos(); // Cargar productos al inicio
});