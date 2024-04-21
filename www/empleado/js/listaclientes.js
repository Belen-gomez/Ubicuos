const socket = io();
let totales = {};
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
        totalElement.textContent = 'Total: ' + totales[user.email] + '€';
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
    const { user, total } = data;
    // Guardar el usuario en una lista de usuarios en LocalStorage
    let guardado = false;
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.forEach(usuario =>{
        if (usuario.email ===user.email){
            guardado = true;
            if (usuario.carrito === user.carrito){
                usuarios.splice(usuarios.indexOf(usuario), 1);
                guardado = false;
                totales[user.email] = total;
            }
        } 
    });
    if(!guardado){
        usuarios.push(user);
        totales[user.email] = total;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        loadUsuarios(usuarios);
    }
});

socket.on('pagoResponse', function (data) {
    const email = data.email;
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.forEach(usuario =>{
        if (usuario.email ===email){
            usuarios.splice(usuarios.indexOf(usuario), 1);
        }
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    loadUsuarios(usuarios);
});