let preguntas = [];
const socket = io();

/* window.onload = async () => {
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
}; */

document.addEventListener("DOMContentLoaded", function() {
    const logoClientes = document.querySelector(".logo-c");
    // Agregar evento de clic al logo de clientes
    logoClientes.addEventListener("click", function() {
        // Redirigir a la página clientes.html
        window.location.href = "listaclientes.html";
    });
    // Funcion para actualizar las preguntas
    const listaPreguntas = document.querySelector(".lista-preguntas");
    // Limpiar el contenedor de preguntas
    listaPreguntas.innerHTML = "";
    const data = {};
    socket.emit('getPreguntas', data);
});

socket.on('preguntasData', (data)=> {
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
        respuestaInput.setAttribute("type", "text");
        respuestaInput.setAttribute("id", "respuesta");
        respuestaInput.setAttribute("placeholder", "Escribe tu respuesta");
        respuestaElement.appendChild(respuestaInput);
        // Crear un elemento <button> para contestar a la pregunta y agregarlo al <div>
        const enviarButton = document.createElement("button");
        enviarButton.classList.add("boton-enviar")
        enviarButton.innerHTML = "&#x27A4;";
        respuestaElement.appendChild(enviarButton);
        // Agregarlo al div
        preguntaElement.appendChild(respuestaElement);

        listaPreguntas.appendChild(preguntaElement);
    });
}
