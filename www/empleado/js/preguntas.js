let preguntas = [];
const socket = io();

const logoClientes = document.querySelector(".logo-c");
logoClientes.addEventListener("click", function () {
    window.location.href = "listaclientes.html";
});

window.onload = async () => {
    // Funcion para actualizar las preguntas
    const listaPreguntas = document.querySelector(".lista-preguntas");
    // Limpiar el contenedor de preguntas
    listaPreguntas.innerHTML = "";
    const data = {};
    socket.emit('getPreguntas', data);
};

socket.on('preguntasData', (data) => {
    preguntas = data.preguntas;
    console.log(preguntas);
    cargarPreguntas(preguntas);
});

function cargarPreguntas(preguntas) {
    const listaPreguntas = document.querySelector(".lista-preguntas");
    listaPreguntas.innerHTML = "";

    preguntas.forEach(pregunta => {
        const preguntaElement = document.createElement("div");
        preguntaElement.classList.add("pregunta");
        // Crear un elemento <h2> para el nombre del usuario y agregarlo al <div>
        const nombreElement = document.createElement("h2");
        nombreElement.textContent = pregunta.nombre;
        preguntaElement.appendChild(nombreElement);
        // Crear un elemento <p> para el texto de la pregunta y agregarlo al <div>
        const textoPreguntaElement = document.createElement("p");
        textoPreguntaElement.classList.add("texto");
        textoPreguntaElement.textContent = pregunta.texto;
        preguntaElement.appendChild(textoPreguntaElement);
        // Crear un elemento <div> para contestar a la pregunta y agregarlo al <div>
        const respuestaElement = document.createElement("div");
        respuestaElement.classList.add("respuesta");
        // Crear un elemento <input> para contestar a la pregunta y agregarlo al <div>
        const respuestaInput = document.createElement("input");
        respuestaInput.classList.add("respuesta-input");
        respuestaInput.setAttribute("type", "text");
        respuestaInput.setAttribute("id", "respuesta");
        respuestaInput.setAttribute("placeholder", "Escribe tu respuesta");
        respuestaElement.appendChild(respuestaInput);
        // Crear un elemento <button> para contestar a la pregunta y agregarlo al <div>
        const enviarButton = document.createElement("button");
        enviarButton.classList.add("boton-enviar");
        enviarButton.innerHTML = "&#x27A4;";
        // Agregar un event listener al botón de enviar
        enviarButton.addEventListener("click", function () {
            const preguntaEnvio = textoPreguntaElement.textContent;
            const contenidoEnvio = respuestaInput.value;
            // Llamar a la función para enviar el contenido
            enviar(preguntaEnvio, contenidoEnvio);
            // Borrar el input
            respuestaInput.value = '';
        });
        respuestaElement.appendChild(enviarButton);
        // Agregarlo al div
        preguntaElement.appendChild(respuestaElement);

        listaPreguntas.appendChild(preguntaElement);
    });
}

function enviar(pregunta, respuesta) {
    // Enviar el contenido al servidor
    const data = {
        pregunta: pregunta,
        respuesta: respuesta
    };
    socket.emit('resPregunta', data);
}

socket.on('pagoEmpleado', function (data) {
    const user = data.user;

    // Guardar el usuario en una lista de usuarios en LocalStorage
    let guardado = false;
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.forEach(usuario => {
        if (usuario.email === user.email) {
            guardado = true;
            if (usuario.carrito === user.carrito) {
                usuarios.splice(usuarios.indexOf(usuario), 1);
                guardado = false;
            }
        }
    });
    if (!guardado) {
        usuarios.push(user);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
});