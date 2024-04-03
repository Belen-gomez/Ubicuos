const loadClients = (data) => {
    const clientListContainer = document.getElementById("client-list");
    clientListContainer.innerHTML = "";
  
    data.forEach(client => {
      const clientItem = document.createElement("li");
      clientItem.textContent = client.name; // Asume que cada cliente tiene una propiedad 'name'
      clientListContainer.appendChild(clientItem);
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    socket.on('load_clients', loadClients);
  });
  
