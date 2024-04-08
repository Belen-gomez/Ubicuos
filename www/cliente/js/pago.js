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
};