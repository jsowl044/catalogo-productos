document.addEventListener('DOMContentLoaded', () => {
    const formProducto = document.getElementById('form-producto');
    const inputProductoId = document.getElementById('producto-id');
    const inputNombre = document.getElementById('nombre');
    const inputDescripcion = document.getElementById('descripcion');
    const inputPrecio = document.getElementById('precio');
    const inputImagen = document.getElementById('imagen');
    const inputRebaja = document.getElementById('rebaja');
    const previewImagenDiv = document.getElementById('preview-imagen');
    const listaProductosDiv = document.getElementById('lista-productos');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnCancelar = document.getElementById('btn-cancelar');
    let productos = [];

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

    adminBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevenir que el clic se propague
        adminForm.classList.remove("hidden");
    });
    
    // Si se hace clic fuera del formulario, se cierra
    document.addEventListener("click", (e) => {
        if (!adminForm.contains(e.target) && e.target !== adminBtn) {
            adminForm.classList.add("hidden");
        }
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
        // ========= MENÚ HAMBURGUESA ==========

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
            const imagenMax = 1 * 1024 * 1024; // 1 MB
            if (imagenFile.size > imagenMax) {
                 alert('La imagen es demasiado grande. Debe ser menor a 1 MB.');
                return;
            }
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
        // Obtener el producto existente si es una edición
        const productoExistente = productoId ? obtenerProducto(productoId) : null;
        const nuevoProducto = {
            id: productoId ? productoId : undefined, // Usar ID existente si es edición, sino dejar que el servidor lo genere
            nombre: inputNombre.value.trim(), // Obtener el valor del campo
            descripcion: inputDescripcion.value.trim(), // Obtener el valor del campo
            precio: parseFloat(inputPrecio.value), // Convertir el precio a número
            imagen: imagenBase64 || (productoExistente ? productoExistente.imagen : null), // Mantener la imagen existente si no se selecciona una nueva
            rebaja: inputRebaja.checked
        };
    
        if (!productoId) {
            delete nuevoProducto.id; // Eliminar el campo `id` si es un nuevo producto
        }
        
        await guardarProducto(nuevoProducto);
        cargarProductos();
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
            const timestamp = new Date().getTime();
            const respuesta = await fetch(`/api/productos/sql?t=${timestamp}`, { 
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            if (!respuesta.ok) {
                throw new Error('Error al cargar los productos');
            }
            const datos = await respuesta.json();
            productos = datos;
            mostrarProductos(); // Mostrar los productos en la página
        } catch (error) {
            console.error(error);   
        }   
    } 
    async function guardarProducto(producto) {
        console.log('Guardando producto:', producto);
        producto.rebaja = producto.rebaja ? 1 : 0; // Convertir a 1 o 0 para la base de datos
        try {
            const metodo = producto.id ? 'PUT' : 'POST'; // Usar PUT si el producto tiene ID, POST si es nuevo
            const url = producto.id
                ? `/api/productos/sql/${producto.id}` // Ruta para actualizar un producto existente
                : '/api/productos/sql'; // Ruta para agregar un nuevo producto
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
        if (productos.length === 0) {
            listaProductosDiv.innerHTML = '<p>No hay productos en el catálogo.</p>';
            return;
        }
        productos.forEach(producto => {
            const precio = typeof producto.precio === 'string' ? parseFloat(producto.precio) : producto.precio;
            const precioValido = typeof precio === 'number' ? precio : 0;
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto-item');
            const imagenElemento = document.createElement('img');
             
            
            imagenElemento.src = producto.imagen || '/assets/default.jpg'; // Imagen por defecto si no hay imagen
            
            imagenElemento.alt = producto.nombre;
            imagenElemento.classList.add('producto-imagen');
            const detallesDiv = document.createElement('div');
            detallesDiv.classList.add('producto-detalles');
            detallesDiv.innerHTML = `
            <h3 class="producto-nombre">${producto.nombre}</h3>
            
            <p class="producto-
            descripcion">${producto.descripcion}</p>
            
            <p class="producto-precio">Precio:
            $${precioValido.toFixed(2)}</p>
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
        return productos.find(producto => String(producto.id) === String(id));
    }
    function editarProducto(id) {
        const producto = obtenerProducto(id);
        if (producto) {
            inputProductoId.value = producto.id;
            inputNombre.value = producto.nombre;
            inputDescripcion.value = producto.descripcion;
            inputPrecio.value = producto.precio;
            previewImagenDiv.innerHTML = `<img src="${producto.imagen}" alt="Imagen actual del producto">`;
            btnGuardar.textContent = 'Actualizar Producto';
            btnCancelar.style.display = 'inline-block'; // Mostrar botón cancelar
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Opcional: scroll al formulario
        }
    }
    async function eliminarProducto(id) {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
        try {
            const respuesta = await fetch(`/api/productos/sql/${id}`, {
                method: 'DELETE',
            });
    
            if (!respuesta.ok) {
                throw new Error('Error al eliminar el producto');
            }
            cargarProductos(); 
            
        } catch (error) {
            console.error(error);
        }
    }
    // *** INICIO SECCIÓN "ACERCA DE" ***
    let companyInfo = { integrantes: [] }; // Inicializar con un array de integrantes vacío

   const cargarAcercaDe = async () => {
    try {
     const res = await fetch('/api/company-info/sql');
     const data = await res.json();
     companyInfo = data || { mision: '', vision: '', integrantes: [] }; // Manejar el caso de que no haya información
     mostrarAcercaDe(); // Llamar a la función para mostrar la información
    } catch (error) {
     console.error('Error al cargar información de Acerca de:', error);
    }
   };

   const mostrarAcercaDe = () => {
    const footer = document.getElementById('footer-acerca');
    footer.innerHTML = `
        <section id="acerca">
         <h3 style="color: white">Misión</h3>
         <p id="mision" style="color: white">${companyInfo.mision}</p>
         <h3 style="color: white">Visión</h3>
         <p id="vision" style="color: white">${companyInfo.vision}</p>
         <h3 style="color: white">Integrantes</h3>
         <ul style="color: white;">
          ${companyInfo.integrantes.map(p => `<li id="integrante-${companyInfo.integrantes.indexOf(p)}" style="color: white;">${p.nombre} ${p.apellido}</li>`).join('')}
         </ul>
         <button id="editar-acerca-de">Editar Información</button>
        </section>
       `;

    // Agregar el formulario de edición (inicialmente oculto)
    const formularioEdicion = document.createElement('div');
    formularioEdicion.id = 'formulario-edicion-acerca';
    formularioEdicion.style.display = 'none'; // Ocultar inicialmente
    formularioEdicion.innerHTML = `
        <label for="editar-mision">Misión:</label><textarea id="editar-mision">${companyInfo.mision}</textarea><br>
        <label for="editar-vision">Visión:</label><textarea id="editar-vision">${companyInfo.vision}</textarea><br>
        <label for="editar-integrantes">Integrantes (separados por comas):</label><textarea id="editar-integrantes">${companyInfo.integrantes.map(p => `${p.nombre} ${p.apellido}`).join(', ')}</textarea><br>
        <button id="guardar-acerca-de">Guardar Cambios</button>
       `;
    footer.appendChild(formularioEdicion);

    // Event listeners para mostrar/ocultar el formulario y guardar los cambios
    const botonEditar = document.getElementById('editar-acerca-de');
    botonEditar.addEventListener('click', () => {
     formularioEdicion.style.display = 'block'; // Mostrar el formulario
    });

    const botonGuardar = document.getElementById('guardar-acerca-de');
    botonGuardar.addEventListener('click', async () => {
     const nuevaMision = document.getElementById('editar-mision').value;
     const nuevaVision = document.getElementById('editar-vision').value;
     const nuevosIntegrantesTexto = document.getElementById('editar-integrantes').value;
     const nuevosIntegrantesArray = nuevosIntegrantesTexto.split(',').map(nombreCompleto => {
      const [nombre = '', apellido = ''] = nombreCompleto.trim().split(' ');
      return { nombre: nombre.trim(), apellido: apellido.trim() };
     }).filter(integrante => integrante.nombre || integrante.apellido); // Filtrar entradas vacías

     const datosAGuardar = {
      mision: nuevaMision,
      vision: nuevaVision,
      integrantes: nuevosIntegrantesArray
     };

    try {
        const respuesta = await fetch('/api/company-info/sql', {
            method: 'POST', // Cambiado a POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosAGuardar)
        });
        if (respuesta.ok) {
            // Recargar la información para mostrar los cambios
            cargarAcercaDe();
            formularioEdicion.style.display = 'none'; // Ocultar el formulario
        } else {
            console.error('Error al guardar la información de la compañía');
            const errorData = await respuesta.json();
            console.error(errorData);
            alert('Error al guardar la información. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error al enviar la petición POST:', error);
        alert('Error de conexión al guardar la información.');
    }
    });
   };

    // *** FIN SECCIÓN "ACERCA DE" MODIFICADA ***

    cargarAcercaDe();
    // Inicializar la carga de productos al cargar la página
    cargarProductos();
});