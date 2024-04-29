let productos = [];

// Función para cargar los productos desde el endpoint
function cargarProductosDesdeAPI() {
    fetch("http://52.255.150.182:8080/api/v1/productos")
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos del API:", data);
            productos = data;
            cargarProductos(productos);
        })
        .catch(error => console.error('Error al obtener los datos:', error));

    console.log("Solicitud al API realizada correctamente.");
}

cargarProductosDesdeAPI();

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        let precioSoles = (producto.precio * 3.9).toFixed(2);
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.fotos[0]}" alt="${producto.nombre}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <p class="producto-stock">Stock: ${producto.stock}</p>
                <p class="producto-precio">$${producto.precio} (S/.${precioSoles})</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const idCategoria = e.currentTarget.id;
            const url = `http://52.255.150.182:8080/api/v1/categoria/${idCategoria}/productos`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(`Datos recibidos del API para la categoría ${idCategoria}:`, data);
                    cargarProductos(data);
                })
                .catch(error => console.error(`Error al obtener los datos de la categoría ${idCategoria}:`, error));
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #004e8d, #006bc3)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function () { }
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
}