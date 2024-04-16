const socket = io();
window.onload = async () => {
    try {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        console.log(usuarios);
        loadUsuarios(usuarios);
    } catch (error) {
        console.error('Error:', error);
    }
};

const logoClientes = document.querySelector(".logo-p");
logoClientes.addEventListener("click", function () {
    window.location.href = "preguntas.html";
});

function loadUsuarios(usuarios){
    const listaClientes = document.querySelector(".lista-clientes");
    listaClientes.innerHTML = "";
    usuarios.forEach(user => {
        const clienteElement = document.createElement("div");
        clienteElement.classList.add("cliente");
        const nombreElement = document.createElement("h2");
        nombreElement.textContent = user.nombre;
        clienteElement.appendChild(nombreElement);
        let total = 0;
        user.carrito.forEach(producto => {
            const elemento = document.createElement('li');
            let precio = Number(producto.precio.slice(0, -1));
            if (producto.cantidad > 1) {
                let precio_total = producto.cantidad * precio;
                elemento.textContent = `${producto.producto} (x${producto.cantidad}) : ${precio_total}€`;
                total += precio_total;
            }
            else {
                elemento.textContent = `${producto.producto} (x${producto.cantidad}) : ${producto.precio}`;
                total += precio;
            }
            clienteElement.appendChild(elemento);
        });
        const totalElement = document.createElement('p');
        totalElement.textContent = 'Total: ' + total + '€';
        clienteElement.appendChild(totalElement);
        const boton = document.createElement('button');
        boton.classList.add("boton_principal");
        boton.textContent = 'Cobrar';
        boton.addEventListener('click', () => {
            boton.classList.remove("boton_principal");
            boton.classList.add("espera");
            boton.textContent = 'Esperando...';
            socket.emit('cobrar', user);
        });
        clienteElement.appendChild(boton);
        listaClientes.appendChild(clienteElement);
    });

}
socket.on('pagoEmpleado', function (data) {
    const user = data.user;

    // Guardar el usuario en una lista de usuarios en LocalStorage
    let guardado = false;
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.forEach(usuario =>{
        if (usuario.email ===user.email){
            guardado = true;
            if (usuario.carrito === user.carrito){
                usuarios.splice(usuarios.indexOf(usuario), 1);
                guardado = false;
            }
        } 
    });
    if(!guardado){
        usuarios.push(user);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        loadUsuarios(usuarios);
    }
    
    /* const clienteElement = document.createElement("div");
    clienteElement.classList.add("cliente");
    // Crear un elemento <h2> para el nombre del usuario y agregarlo al <div>
    const nombreElement = document.createElement("h2");
    console.log(user.nombre);
    nombreElement.textContent = user.nombre;
    clienteElement.appendChild(nombreElement);
    
    let total = 0;
    console.log(user.carrito);
    user.carrito.forEach(producto => {
        const elemento = document.createElement('li');
        
        let precio = Number(producto.precio.slice(0, -1));
        if (producto.cantidad > 1) {
            let precio_total = producto.cantidad * precio;
            elemento.textContent = `${producto.producto} (x${producto.cantidad}) : ${precio_total}€`;
            total += precio_total;
        }
        else {
            elemento.textContent = `${producto.producto} (x${producto.cantidad}) : ${producto.precio}`;
            total += precio;
        }

        //elemento.appendChild(document.createElement('p')).textContent = producto.;
        clienteElement.appendChild(elemento);
    });

    const totalElement = document.createElement('p');
    totalElement.textContent = 'Total: ' + total + '€';
    clienteElement.appendChild(totalElement);

    const boton = document.createElement('button');
    boton.classList.add("boton_principal");
    boton.textContent = 'Cobrar';

    boton.addEventListener('click', () => {
        boton.classList.remove("boton_principal");
        boton.classList.add("espera");
        boton.textContent = 'Esperando...';
        socket.emit('cobrar', user);
    });
    clienteElement.appendChild(boton);
    listaClientes.appendChild(clienteElement); */
    /* data.forEach(cliente => {
        const clienteElement = document.createElement("div");
        clienteElement.classList.add("cliente");
        const nombreElement = document.createElement("h2");
        nombreElement.textContent = cliente.nombre;
        clienteElement.appendChild(nombreElement);
        const estadoElement = document.createElement("p");
        estadoElement.textContent = cliente.estado;
        clienteElement.appendChild(estadoElement);
        listaClientes.appendChild(clienteElement);
    }); */

});
/* // Funcion para actualizar las preguntas
function cargarClientes() {
    const listaClientes = document.querySelector(".lista-clientes");
    // Realizar la petición para cargar el archivo JSON
    fetch("clientes.json")
        .then(response => {
            if (!response.ok) {
                alert("Error de red al cargar el archivo JSON");
            }
            return response.json();
        })
        .then(data => {
            // Iterar sobre cada cliente en el JSON y agregarla al contenedor
            data.forEach(cliente => {
                const clienteElement = document.createElement("div");
                clienteElement.classList.add("cliente");
                // Crear un elemento <h2> para el nombre del usuario y agregarlo al <div>
                const nombreElement = document.createElement("h2");
                nombreElement.textContent = cliente.nombre;
                clienteElement.appendChild(nombreElement);
                const estadoElement = document.createElement("p");
                estadoElement.textContent = cliente.estado
            });
        })
        .catch(error => {
            console.error("Error al cargar el archivo JSON:", error);
            // Aquí puedes manejar el error de manera apropiada, como mostrar un mensaje al usuario
            alert("Error al cargar el JSON")
        });
}

// NO SÉ SI FUNCIONA...
// Función para verificar el estado del cliente
async function comprobarEstado() {
    try {
        // Solicitar permiso del usuario para acceder a dispositivos Bluetooth
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [/* UUID del servicio del dispositivo ] }],
            optionalServices: [/* UUIDs de servicios adicionales si es necesario ]
        });

        // Si el dispositivo está emparejado, devolver 1
        return 1;
    } catch (error) {
        // Si hay algún error o el dispositivo no está emparejado, devolver 0
        return 0;
    }
} */

