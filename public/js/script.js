document.addEventListener('DOMContentLoaded', () => {

    const contenedorProductos = document.getElementById('contenedor-productos');
    const carrusel = document.querySelector('#image-carousel .splide__list');
    const inputBusqueda = document.getElementById('buscador');
    let productosJSON = [];


    // Función para generar el carrusel de imágenes
    const generarCarrusel = (productos) => {
        carrusel.innerHTML = ''; // Limpiar el carrusel antes de agregar imágenes
        productos.forEach(producto => {
            const slide = document.createElement('li');
            slide.classList.add('splide__slide');
            slide.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
            carrusel.appendChild(slide);
        });

        // Inicializar el carrusel con Splide.js
        new Splide('#image-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            autoplay: true,
            interval: 3000, 
            pauseOnHover: true, 
            heightRatio: 0.3,
            pagination: true, // Mostrar indicadores de página
            arrows: true,     // Mostrar botones de navegación
        }).mount();
    };

    // Función para buscar productos
    const buscarProductos = (busqueda, tipo) => {
        if (tipo === 'nombre') {
            // Búsqueda por nombre
            const textoBusqueda = busqueda.toLowerCase();
            return productosJSON.filter(p => p.nombre.toLowerCase().includes(textoBusqueda));
        } else if (tipo === 'id') {
            // Búsqueda por ID
            return productosJSON.find(p => String(p.id) === String(busqueda)) || null;
        }
    };

    // Agregar evento de búsqueda al input
    inputBusqueda.addEventListener('input', () => {
        const busqueda = inputBusqueda.value; // Obtener el texto ingresado
        const productosFiltrados = buscarProductos(busqueda, 'nombre'); // Buscar por nombre
        mostrarProductos(productosFiltrados); // Mostrar los productos filtrados
    });
    // Función para mostrar detalles del producto en un modal
    const mostrarDetallesProducto = (productoId) => {
        // Buscar el producto en el arreglo `productosJSON` por su ID
        const producto = buscarProductos(productoId, 'id');
        if (producto) {
            // Crear un modal o contenedor para mostrar los detalles
            const modalHTML = `
                <div id="modal-detalles" class="modal">
                    <div class="modal-contenido">
                        <span id="cerrar-modal" class="cerrar">&times;</span>
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                        <h2>${producto.nombre}</h2>
                        <p>${producto.descripcion}</p>
                        <p>Precio: $${producto.precio.toFixed(2)}</p>
                    </div>
                </div>
            `;
            // Insertar el modal en el cuerpo del documento
            document.body.insertAdjacentHTML('beforeend', modalHTML);
    
            // Agregar funcionalidad para cerrar el modal
            const cerrarModal = document.getElementById('cerrar-modal');
            cerrarModal.addEventListener('click', () => {
                const modal = document.getElementById('modal-detalles');
                modal.remove(); // Eliminar el modal del DOM
            });
        }
    };
    contenedorProductos.addEventListener('click', (event) => {
        const productoHTML = event.target.closest('.producto'); // Verificar si se hizo clic en un producto
        if (productoHTML) {
            const productoId = parseInt(productoHTML.getAttribute('data-id')); // Obtener el ID del producto
            mostrarDetallesProducto(productoId); // Mostrar los detalles del producto
        }
    });

    


    // Función para cargar los productos desde el servidor (API)
    const cargarProductos = async () => {
        try {
            const respuesta = await fetch('/api/productos'); // Petición al backend
            productosJSON = await respuesta.json(); // Convertir la respuesta a JSON
            mostrarProductos(productosJSON); // Mostrar los productos en la página
            generarCarrusel(productosJSON); // Generar el carrusel con las imágenes de los productos
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            contenedorProductos.innerHTML = '<p>Error al cargar los productos. Por favor, intenta de nuevo más tarde.</p>';
        }
    };

    // Función para mostrar los productos en el HTML
    const mostrarProductos = (productos) => {
        contenedorProductos.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos
        productos.forEach(producto => {
            const productoHTML = document.createElement('div');
            productoHTML.classList.add('producto'); // Clase CSS para estilos
            productoHTML.setAttribute('data-id', producto.id); // Agregar el atributo data-id
            productoHTML.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p>Precio: $${producto.precio.toFixed(2)}</p>
            `;
            contenedorProductos.appendChild(productoHTML);
        });
    };

    // Inicializar la carga de productos al cargar la página
    cargarProductos();
});