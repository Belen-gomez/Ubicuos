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
  
// Empleado

// document.addEventListener('DOMContentLoaded', () => {
//   const socket = io();

//   navigator.bluetooth.requestDevice({ acceptAllDevices: true })
//   .then(device => {
//     console.log('Conectando al dispositivo...', device.name);
//     // Cuando el empleado detecta un cliente cercano
//     socket.emit('clientNearby', device.id);
//   })
//   .catch(error => { console.log(error); });
// });
