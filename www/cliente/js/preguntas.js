// Crear conexión con el servidor
const socket = io();

let pregunta;

window.onload = async () => {
    try {
        /* const response = await fetch('/getUser');
        if (!response.ok) {
          throw new Error('No has iniciado sesión');
        }
        user = await response.json(); */

        user = JSON.parse(localStorage.getItem('usuario'));
        document.title = `¡Bienvenido ${user.nombre}!`;

    } catch (error) {
        console.error('Error:', error);
    }

    // Actualizar las preguntas y respuestas del usuario
    const data = {};
    socket.emit('getPreguntas', data);
    // Seleccionar solo las preguntas del usuario con el email
    socket.on('preguntasData', (data) => {
        preguntasUsuario = data.preguntas.filter(pregunta => pregunta.email === user.email);
        console.log(preguntasUsuario);
        actualizarPreguntas(preguntasUsuario);
    });
};

// Iniciar reconocimiento de voz
let recognition = new window.webkitSpeechRecognition();
recognition.lang = 'es-ES'; // Ajusta el idioma a español
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let speechToText = '';
let isRecording = false;

// Agregar evento de click al elemento de imagen del micrófono
let microImage = document.getElementById('micro');
microImage.addEventListener('click', function () {
    if (!isRecording) {
        // Cambiar el color de borde a rojo
        microImage.style.border = '2px solid red';
        // Iniciar reconocimiento de voz
        recognition.start();
        isRecording = true;
    } else {
        // Restaurar el color de borde
        microImage.style.border = '';
        // Detener reconocimiento de voz
        recognition.stop();
        isRecording = false;
    }
});

recognition.onresult = function (event) {
    speechToText = event.results[0][0].transcript;
    // Convertir la primera letra a mayúscula
    speechToText = speechToText.charAt(0).toUpperCase() + speechToText.slice(1);

    let preguntaInput = document.getElementById('pregunta-input').value;
    if (preguntaInput != '') {
        pregunta = preguntaInput;
    }
    if (speechToText != '') {
        let preguntaBox = document.getElementById('pregunta-input');
        preguntaBox.value = speechToText;
        pregunta = speechToText;
    }
}

recognition.onspeechend = function () {
    recognition.stop();
}

/* HASTA AQUI NACHO! */

enviar = document.getElementById('btn-enviar');
enviar.addEventListener('click', add => {
    add.preventDefault();

    let preguntaInput = document.getElementById('pregunta-input').value;

    agregarPregunta(user.nombre, user.email, preguntaInput);
    // Borrar el input
    document.getElementById('pregunta-input').value = '';
});

function agregarPregunta(nombre, email, pregunta) {
    let newPregunta = {
        "email": email,
        "nombre": nombre,
        "texto": pregunta,
        "respuesta": ""
    }
    socket.emit('textMessage', newPregunta);
}

function cargarPregunta(pregunta, respuesta) {
    let listaRespuestas = document.querySelector(".respuestas");
    
    const respuestaBox = document.createElement("div");
    respuestaBox.classList.add("respuesta");

    const preguntaElement = document.createElement("p");
    preguntaElement.classList.add("preg");
    preguntaElement.textContent = pregunta;
    respuestaBox.appendChild(preguntaElement);

    const respuestaElement = document.createElement("p");
    respuestaElement.classList.add("res");
    if (respuesta === "") {
        respuestaElement.textContent = "Aquí aparecerá tu respuesta...";
        respuestaElement.style.color = "gray";
    } else {
        respuestaElement.textContent = respuesta;
        respuestaElement.style.color = "black";
    }
    respuestaBox.appendChild(respuestaElement);

    listaRespuestas.appendChild(respuestaBox);
}

function actualizarPreguntas(preguntasUsuario) {
    let listaRespuestas = document.querySelector(".respuestas");
    listaRespuestas.innerHTML = "";
    // Para cada pregunta, cargarla en la lista de respuestas
    preguntasUsuario.forEach(pregunta => {
        cargarPregunta(pregunta.texto, pregunta.respuesta);
    });
}

socket.on('respuestaData', (data) => {
    console.log("Respuesta recibida: ", data);
    cargarRespuesta(data.pregunta, data.respuesta);
});

function cargarRespuesta(pregunta, respuesta) {
    console.log("Cargando respuesta...");
    console.log(pregunta, respuesta);
    let listaRespuestas = document.querySelector(".respuestas");
    listaRespuestas.innerHTML = "";
    // Para cada pregunta, cargarla en la lista de respuestas
    preguntasUsuario.forEach(p => {
        if (p.texto === pregunta) {
            cargarPregunta(p.texto, respuesta);
        } else {
            cargarPregunta(p.texto, p.respuesta);
        }
    });
    
}