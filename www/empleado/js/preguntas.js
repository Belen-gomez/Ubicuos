// Funcion para actualizar las preguntas
function cargarPreguntas() {
    const listaPreguntas = document.querySelector(".lista-preguntas");
    // Realizar la petición para cargar el archivo JSON
    fetch("preguntas.json")
        .then(response => {
            if (!response.ok) {
                alert("Error de red al cargar el archivo JSON");
            }
            return response.json();
        })
        .then(data => {
            // Iterar sobre cada pregunta en el JSON y agregarla al contenedor
            data.forEach(pregunta => {
                const preguntaElement = document.createElement("div");
                preguntaElement.classList.add("pregunta");
                // Crear un elemento <h2> para el nombre del usuario y agregarlo al <div>
                const nombreElement = document.createElement("h2");
                nombreElement.textContent = pregunta.nombre;
                preguntaElement.appendChild(nombreElement);
                // Crear un elemento <p> para el texto de la pregunta y agregarlo al <div>
                const textoPreguntaElement = document.createElement("p");
                textoPreguntaElement.classList.add("texto");
                textoPreguntaElement.textContent = pregunta.pregunta;
                preguntaElement.appendChild(textoPreguntaElement);
                // Crear un elemento <div> para contestar a la pregunta y agregarlo al <div>
                const respuestaElement = document.createElement("div");
                // Crear un elemento <input> para contestar a la pregunta y agregarlo al <div>
                const respuestaInput = document.createElement("input");
                respuestaInput.setAttribute("type", "text");
                respuestaInput.setAttribute("id", "respuesta");
                respuestaInput.setAttribute("placeholder", "Escribe aquí tu respuesta");
                preguntaElement.appendChild(respuestaInput);
                // Crear un elemento <button> para contestar a la pregunta y agregarlo al <div>
                const enviarButton = document.createElement("button");
                enviarButton.classList.add("boton-enviar")
                enviarButton.innerHTML = "&#x27A4;";        // "&#10140;"
                respuestaElement.appendChild(enviarButton);
                // Agregarlo al div
                preguntaElement.appendChild(respuestaElement);
            });
        })
        .catch(error => {
            console.error("Error al cargar el archivo JSON:", error);
            // Aquí puedes manejar el error de manera apropiada, como mostrar un mensaje al usuario
            alert("Error al cargar el JSON")
        });
}

document.addEventListener("DOMContentLoaded", function() {
    const logoClientes = document.querySelector(".logo-c");
    // Agregar evento de clic al logo de clientes
    logoClientes.addEventListener("click", function() {
        // Redirigir a la página clientes.html
        window.location.href = "listaclientes.html";
    });

    // Ejecuta la función cargarPreguntas cada 5 segundos (5000 milisegundos)
    setInterval(cargarPreguntas, 5000); 
});
