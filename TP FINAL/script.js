// Variables
let habitaciones = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Elementos del HTML
const listaHabitaciones = document.getElementById("lista-habitaciones");
const listaMerchandising = document.getElementById("lista-merchandising");
const listaCarrito = document.getElementById("lista-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const totalCarrito = document.getElementById("total-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const botonConfirmar = document.getElementById("btn-confirmar");
const mensajeReserva = document.getElementById("mensaje-reserva");

// Cargar datos desde JSON local con Fetch API
async function cargarHabitaciones() {
    try {
        const respuesta = await fetch("habitaciones.json");
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los datos");
        }
        habitaciones = await respuesta.json();
        mostrarHabitaciones();
        mostrarMerchandising();
        actualizarCarrito();
    } catch (error) {
        listaHabitaciones.innerHTML =
            "<p>No se pudieron cargar las habitaciones. Intentá nuevamente.</p>";
        listaMerchandising.innerHTML =
            "<p>No se pudo cargar el merchandising. Intentá nuevamente.</p>";
        console.error(error);
    }
}

// Mostrar habitaciones en su contenedor
function mostrarHabitaciones() {
    listaHabitaciones.innerHTML = "";
    const soloHabitaciones = habitaciones.filter(item => item.tipo === "habitacion");

    soloHabitaciones.forEach(habitacion => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");
        tarjeta.innerHTML = `
            <img src="${habitacion.imagen}" alt="${habitacion.nombre}">
            <h3>${habitacion.nombre}</h3>
            <p>${habitacion.descripcion}</p>
            <p>Capacidad: ${habitacion.capacidad} personas</p>
            <h3>$${habitacion.precio.toLocaleString("es-AR")}</h3>
            <button type="button" onclick="agregarAlCarrito(${habitacion.id})">
                Agregar a la reserva
            </button>
        `;
        listaHabitaciones.appendChild(tarjeta);
    });
}

// Mostrar merchandising en su contenedor separado
function mostrarMerchandising() {
    listaMerchandising.innerHTML = "";
    const soloMerch = habitaciones.filter(item => item.tipo === "merchandising");

    soloMerch.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>Merchandising oficial</strong></p>
            <h3>$${producto.precio.toLocaleString("es-AR")}</h3>
            <button type="button" onclick="agregarAlCarrito(${producto.id})">
                Agregar al carrito
            </button>
        `;
        listaMerchandising.appendChild(tarjeta);
    });
}

// Agregar al carrito
function agregarAlCarrito(id) {
    const producto = habitaciones.find(item => item.id === id);
    if (!producto) return;

    const existente = carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarCarrito();
    mensajeReserva.textContent = "Producto agregado.";
}

// Guardar carrito
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Actualizar carrito
function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        cantidadTotal += producto.cantidad;

        const elemento = document.createElement("div");
        elemento.classList.add("item-carrito");
        elemento.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toLocaleString("es-AR")}</p>
            <label>
                Cantidad:
                <input
                    type="number"
                    min="1"
                    value="${producto.cantidad}"
                    onchange="cambiarCantidad(${producto.id}, this.value)"
                >
            </label>
            <p>Subtotal: $${subtotal.toLocaleString("es-AR")}</p>
            <button type="button" onclick="eliminarDelCarrito(${producto.id})">
                Eliminar
            </button>
            <hr>
        `;
        listaCarrito.appendChild(elemento);
    });

    contadorCarrito.textContent = cantidadTotal;
    totalCarrito.textContent = total.toLocaleString("es-AR");
    carritoVacio.style.display = carrito.length === 0 ? "block" : "none";
    botonConfirmar.disabled = carrito.length === 0;
}

// Cambiar cantidad
function cambiarCantidad(id, cantidad) {
    cantidad = parseInt(cantidad);
    if (isNaN(cantidad) || cantidad < 1) {
        cantidad = 1;
    }
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.cantidad = cantidad;
        guardarCarrito();
        actualizarCarrito();
    }
}

// Eliminar del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarrito();
}

// Confirmar reserva
botonConfirmar.addEventListener("click", function () {
    if (carrito.length === 0) return;

    const total = carrito.reduce((suma, producto) => {
        return suma + producto.precio * producto.cantidad;
    }, 0);

    mensajeReserva.textContent =
        "¡Reserva simulada correctamente! Total: $" +
        total.toLocaleString("es-AR");

    carrito = [];
    guardarCarrito();
    actualizarCarrito();
});

// Validar formulario de contacto
const formulario = document.querySelector(".formulario-contacto");
formulario.addEventListener("submit", function(event) {
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombre === "" || correo === "" || mensaje === "") {
        event.preventDefault();
        alert("Todos los campos son obligatorios.");
    } else if (!formatoCorreo.test(correo)) {
        event.preventDefault();
        alert("Ingresá un correo electrónico válido.");
    }
});

// Iniciar programa
cargarHabitaciones();