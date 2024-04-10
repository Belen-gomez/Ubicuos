// Función para verificar campos
function verificarCampos(numero, contrasena) {
    // Número de empleado
    if (isNaN(numero) || numero.length !== 5) {
        alert("El número de empleado debe ser un número de 5 dígitos");
        return false;
    }
    // Contraseña
    if (!(/[A-Z]/.test(contrasena)) || !(/[a-zA-Z]{3,}/.test(contrasena)) || !(/\d/.test(contrasena))) {
        alert("La contraseña debe contener al menos 3 letras, una mayúscula y un número");
        document.getElementById("password").value = "";
        return false;
    }
    return true;
}

const iniciar = document.getElementById("login");

iniciar.addEventListener("click", add => {
    add.preventDefault();
    const number = document.getElementById('number').value;
    const password = document.getElementById('password').value;
    verificarCampos(number, password);

    const data = { number, password };
    fetch('/login-e', {
        method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data, null)
    })
    
    .then(response => {
        if (response.ok) {
            alert('Inicio de sesión exitoso');
            window.location.href = "preguntas.html";
        } else {
            response.text().then(message => alert(message));
        }
    })
    .catch(error => console.error('Error:', error));
    navigator.bluetooth.requestDevice({ acceptAllDevices: true })
        .then(device => {
          console.log('El usuario ha seleccionado el dispositivo:', device.name);
          // Cuando el cliente da permiso, emitir su ID a través de socket.io
          socket.emit('clientConnected', device.id);
        })
        .catch(error => { console.log(error); });
});

const borrar = document.getElementById("borrar");
borrar.addEventListener("click", function() {
    document.getElementById("number").value = "";
    document.getElementById("password").value = "";
});

/*document.addEventListener("DOMContentLoaded", function() {
    var botonEnviar = document.getElementById("login");
    // Agregar evento click al botón de enviar
    botonEnviar.addEventListener("click", function() {
        // Obtener valores de los campos
        var numero = document.getElementById("number").value;
        var contrasena = document.getElementById("password").value;
        if (numero !== "" && contrasena !== "") {
            // Realizar petición para verificar si el número de empleado existe en el JSON
            fetch("../../empleados.json")
                .then(response => response.json())
                .then(data => {
                    // Comprobar si el número de empleado existe en el JSON
                    var empleadoExiste = data.find(empleado => empleado.numeroEmpleado === numero);
                    if (empleadoExiste) {
                        // Si existe, verificar contraseña
                        if (empleadoExiste.contraseña === contrasena) {
                            // Redirigir al usuario a la siguiente página llamada preguntas
                            window.location.href = "preguntas.html";
                        } else {
                            alert("Contraseña incorrecta");
                            document.getElementById("password").value = "";
                        }
                    } else {
                        // Si no existe, agregar nuevo empleado al JSON
                        verificarCampos(numero, contrasena);
                        var nuevoEmpleado = {
                            numeroEmpleado: numero,
                            contraseña: contrasena
                        };
                        data.push(nuevoEmpleado);
                        // Actualizar el JSON
                        fetch("../../empleados.json", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(data)
                        })
                        .then(() => {
                            alert("Usuario agregado correctamente");
                            // Redirigir al usuario a la siguiente página llamada preguntas
                            window.location.href = "preguntas.html";                        })
                        .catch(error => console.error("Error al actualizar el JSON", error));
                    }
                })
                .catch(error => console.error("Error al cargar el JSON", error));
        }
    });
    // Boton de eliminar
    var botonBorrar = document.getElementById("borrar");
    botonBorrar.addEventListener("click", function() {
        document.getElementById("number").value = "";
        document.getElementById("password").value = "";
    });

});*/
