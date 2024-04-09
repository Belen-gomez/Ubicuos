// Crear conexión con el servidor
const socket = io();
let pregunta;

window.onload = async () => {
  try {
    const response = await fetch('/getUser');
    if (!response.ok) {
      throw new Error('No has iniciado sesión');
    }
    user = await response.json();
    document.title = `¡Bienvenido ${user.nombre}!`;
    
    // Make socket request to get carrito data
    console.log(user.email);
    socket.emit('getCarrito', user.email);
  } catch (error) {
    console.error('Error:', error);
  }
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
microImage.addEventListener('click', function() {
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

recognition.onresult = function(event) {
    speechToText = event.results[0][0].transcript;
    
    let preguntaInput = document.getElementById('pregunta-input').value;
    if (preguntaInput!=null){
        pregunta = preguntaInput;
    }
    if (speechToText != '') {
        let preguntaBox = document.getElementById('pregunta-input');
        preguntaBox.value = speechToText;
        pregunta = speechToText;
    }
    
    agregarPregunta(user.nombre, user.email, pregunta);
}

recognition.onspeechend = function() {
  recognition.stop();
}

/* HASTA AQUI NACHO! */

enviar = document.getElementById('btn-enviar');

enviar.addEventListener('click', add => {
    add.preventDefault();

    
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