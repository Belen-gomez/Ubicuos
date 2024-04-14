// Espera a que la página se cargue completamente
window.onload = async function() {
    const listaProductos = document.getElementById('productos');
    // listaProductos.style.display = 'none';
    const texto2 = document.getElementById('texto2');
    texto2.style.display = 'none';
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
    
        console.log('Conexión establecida con éxito:', dispositivo.name);
        boton.style.display = 'none';
        const texto = document.getElementById('texto');
        texto.style.display = 'none';
        texto2.style.display = 'block';
    });

    // Verifica si el navegador soporta la API Web NFC
    if ('NDEFReader' in window) {
        // Crea un nuevo lector NFC
        const ndef = new NDEFReader();
    
        // Solicita permiso para leer etiquetas NFC
        ndef.scan().then(() => {
        console.log("Escaneo iniciado exitosamente.");
        }).catch(error => {
        console.log(`Error al iniciar el escaneo: ${error}.`);
        });
    
        // Define qué hacer cuando se lee una nueva etiqueta NFC
        ndef.onreading = ({ message, serialNumber }) => {
        console.log(`Etiqueta NFC leída con número de serie: ${serialNumber}`);
        window.open("../carrito.html");
        
        };
    } else {
        console.log("Tu navegador no soporta la API Web NFC.");
    }
  


};