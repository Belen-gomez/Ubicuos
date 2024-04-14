// Espera a que la página se cargue completamente
window.onload = async function() {
    try {
        // Solicita al usuario que seleccione un dispositivo Bluetooth
        const dispositivo = await navigator.bluetooth.requestDevice({
            filters: [{services: ['<TU_SERVICIO_BLUETOOTH>']}]
        });

        // Conecta al dispositivo seleccionado
        const servidor = await dispositivo.gatt.connect();

        // Aquí puedes realizar operaciones con el dispositivo Bluetooth conectado

        console.log('Conexión establecida con éxito:', dispositivo.name);
    } catch(error) {
        console.error('Error de Bluetooth:', error);
    }

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
        window.open("./confirmacionpago.html");
        
        };
    } else {
        console.log("Tu navegador no soporta la API Web NFC.");
    }
  


};