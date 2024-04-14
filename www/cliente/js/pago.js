let user;
let email;
let carrito = [];
const socket = io();
// Espera a que la página se cargue completamente
window.onload = async function () {
    try {
        user = JSON.parse(localStorage.getItem('usuario'));
        // Al cargar la página primero se obtiene el carrito que tiene el usuario guardado

        carrito = user.carrito;
        email = user.email;
        console.log(email);
    } catch (error) {
        console.error('Error:', error);
    }

};

// // Verifica si el navegador soporta la API Web NFC
// if ('NDEFReader' in window) {
//     // Crea un nuevo lector NFC
//     const ndef = new NDEFReader();

//     // Solicita permiso para leer etiquetas NFC
//     ndef.scan().then(() => {
//     console.log("Escaneo iniciado exitosamente.");
//     }).catch(error => {
//     console.log(`Error al iniciar el escaneo: ${error}.`);
//     });

//     // Define qué hacer cuando se lee una nueva etiqueta NFC
//     ndef.onreading = ({ message, serialNumber }) => {
//     console.log(`Etiqueta NFC leída con número de serie: ${serialNumber}`);
//     window.open("../carrito.html");

//     };
// } else {
//     console.log("Tu navegador no soporta la API Web NFC.");
// }


function loadProductos(carrito) {
    // Mostrar todos los productos del carrito en la pantalla
    let total = 0;
    const texto2 = document.getElementById('texto2');
    texto2.style.display = 'block';
    const listaProductos = document.querySelector('.productos');
    carrito.forEach(producto => {
        console.log(carrito);
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
        listaProductos.appendChild(elemento);
    });

    const totalElement = document.createElement('p');
    totalElement.textContent = 'Total: ' + total + '€';
    listaProductos.appendChild(totalElement);


}

//al darle al boton de seleccionar caja se pide el bluetooth
const boton = document.getElementById('selCaja');
boton.addEventListener('click', async () => {
    // Solicita al usuario que seleccione un dispositivo Bluetooth
    const dispositivo = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
    });

    // Conecta al dispositivo seleccionado
    const servidor = await dispositivo.gatt.connect();

    // Aquí puedes realizar operaciones con el dispositivo Bluetooth conectado
    loadProductos(carrito);
    console.log('Conexión establecida con éxito:', dispositivo.name);
    boton.style.display = 'none';
    const texto = document.getElementById('texto');
    texto.style.display = 'none';

    let data = { user};
    socket.emit('pago',data);

});
/* const email = user.email; */
/* console.log(user); */
socket.on(email, function (data) {
    console.log("ha llegado");
    if (data.ok) {
        gif = document.querySelectord('.gif_nfc');
        gif.style.display = 'block';
    }
    else {
        alert("Error en el pago")
    }
});