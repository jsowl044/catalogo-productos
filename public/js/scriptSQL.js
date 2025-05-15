document.addEventListener('DOMContentLoaded', () => {

    const contenedorProductos = document.getElementById('contenedor-productos');
    const carrusel = document.querySelector('#image-carousel .splide__list');
    const inputBusqueda = document.getElementById('buscador');
    let productosJSON = [];

     // ========= MENÚ HAMBURGUESA ==========
     const menuToggle = document.getElementById("menu-toggle");
     const menu = document.getElementById("menu");
     const usuarioBtn = document.getElementById("usuario-btn");
     const adminBtn = document.getElementById("admin-btn");
     const adminForm = document.getElementById("admin-form");
     const adminLoginBtn = document.getElementById("admin-login");
 
     menuToggle.addEventListener("click", () => {
         menu.style.display = menu.style.display === "flex" ? "none" : "flex";
     });
 
     usuarioBtn.addEventListener("click", () => {
         window.location.href = "index.html";
     });
 
     adminBtn.addEventListener("click", () => {
         adminForm.classList.toggle("hidden");
     });
 
     adminLoginBtn.addEventListener("click", () => {
         const user = document.getElementById("admin-user").value;
         const pass = document.getElementById("admin-pass").value;
 
         if (user && pass) {
             window.location.href = "admin.html";
         } else {
             alert("Por favor ingresa usuario y contraseña.");
         }
     });
    



    // Función para generar el carrusel de imágenes
    const generarCarrusel = (productos) => {
        carrusel.innerHTML = ''; // Limpiar el carrusel antes de agregar imágenes
        productos.forEach(producto => {
            if (producto.imagen) {
                const slide = document.createElement('li');
                slide.classList.add('splide__slide');
                slide.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
                carrusel.appendChild(slide);
            }
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
            pagination: true, 
            arrows: true,     
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
        // Eliminar cualquier modal abierto previamente
        const modalAnterior = document.getElementById('modal-detalles');
        if (modalAnterior) modalAnterior.remove();
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
                        <p id="precio" >Precio: $${parseFloat(producto.precio).toFixed(2)}</p>
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
            document.body.addEventListener('click', (event) => {
                const modal = document.getElementById('modal-detalles');
                if (modal && event.target === modal) {
                    modal.remove();
                }
            });
        }
    };
    contenedorProductos.addEventListener('click', (event) => {
        const productoHTML = event.target.closest('.producto'); // Verificar si se hizo clic en un producto
        if (productoHTML) {
            const productoId = productoHTML.getAttribute('data-id'); // Obtener el ID del producto
            mostrarDetallesProducto(productoId); // Mostrar los detalles del producto
        }
    });

    


    // Función para cargar los productos desde el servidor (API)
    const cargarProductos = async () => {
        try {
            const respuesta = await fetch('/api/productos/sql'); // Petición al backend
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
            const productoBox = document.createElement('div');
            productoBox.classList.add('producto-box'); // Contenedor con perspectiva
        
            const productoElemento = document.createElement('div');
            productoElemento.classList.add('producto'); // Componente que gira
             productoElemento.setAttribute('data-id', producto.id);
        
            const precio = typeof producto.precio === 'number' ? producto.precio : parseFloat(producto.precio) || 0;
            productoElemento.innerHTML = `
                <div class="producto-frente">
                    <img src="${producto.imagen ? producto.imagen : '/assets/default.jpg'}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                </div>
                <div class="producto-dorso">
                    <p>${producto.descripcion}</p>
                    <p id="precio">Precio: $${precio.toFixed(2)}</p>
                    <p id="rebaja">Existe rebaja: ${producto.rebaja ? "Sí" : "No"}</p>
                </div>
            `;
        
            productoBox.appendChild(productoElemento);
            contenedorProductos.appendChild(productoBox);
        });
        
    };

    // Seccion de Acerca de
    const cargarAcercaDe = async () => {
        try {
            const res = await fetch('/api/company-info/sql');
            const data = await res.json();
    
            const footer = document.getElementById('footer-acerca');
            footer.innerHTML = `
                <section id="acerca">
                    <h3 style="color: white">Misión</h3>
                    <p style="color: white">${data.mision}</p>
                    <h3 style="color: white">Visión</h3>
                    <p style="color: white">${data.vision}</p>
                    <h3 style="color: white">Integrantes</h3>
                    <ul style="color: white;">
                        ${data.integrantes.map(p => `<li>${p.nombre} ${p.apellido}</li>`).join('')}
                    </ul>
                </section>
            `;
        } catch (error) {
            console.error('Error al cargar información de Acerca de:', error);
        }
    };
    cargarAcercaDe();
    // Inicializar la carga de productos al cargar la página
    cargarProductos();
});