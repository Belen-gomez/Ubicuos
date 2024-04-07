// Funcion para actualizar las preguntas
function cargarClientes() {
    const listaClientes = document.querySelector(".lista-clientes");
    // Realizar la petición para cargar el archivo JSON
    fetch("clientes.json")
        .then(response => {
            if (!response.ok) {
                alert("Error de red al cargar el archivo JSON");
            }
            return response.json();
        })
        .then(data => {
            // Iterar sobre cada cliente en el JSON y agregarla al contenedor
            data.forEach(cliente => {
                const clienteElement = document.createElement("div");
                clienteElement.classList.add("cliente");
                // Crear un elemento <h2> para el nombre del usuario y agregarlo al <div>
                const nombreElement = document.createElement("h2");
                nombreElement.textContent = cliente.nombre;
                clienteElement.appendChild(nombreElement);
                const estadoElement = document.createElement("p");
                estadoElement.textContent = cliente.estado
            });
        })
        .catch(error => {
            console.error("Error al cargar el archivo JSON:", error);
            // Aquí puedes manejar el error de manera apropiada, como mostrar un mensaje al usuario
            alert("Error al cargar el JSON")
        });
}

// NO SÉ SI FUNCIONA...
// Función para verificar el estado del cliente
