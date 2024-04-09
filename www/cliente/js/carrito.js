var user;
var carrito = [];

const socket = io();
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

// Listen for carrito data from socket
socket.on('carritoData', (data) => {
  carrito = data.carrito;
  console.log(carrito);
  // Call function to load carrito data into UI
  loadCarrito(carrito);
});


const camara = document.getElementById('camara');

camara.addEventListener('click', () => {
    const containerVideo = document.createElement('div');
    containerVideo.className = 'container-video';

    const videoElement = document.createElement('video');
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('playsinline', '');
    videoElement.className = 'video-camara';

    const botonCerrar = document.createElement('div');
    botonCerrar.textContent = '✖️';
    botonCerrar.className = 'boton-cerrar'; 

    botonCerrar.addEventListener('click', () => {
        containerVideo.remove();
    });

    containerVideo.appendChild(videoElement);
    containerVideo.appendChild(botonCerrar);
    document.body.appendChild(containerVideo); 
    
    var constraints = { audio: false, video: {facingMode: "environment" } }; 

    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
        videoElement.srcObject = mediaStream;
        videoElement.onloadedmetadata = function(e) {
            videoElement.play();
            scanQRCode(videoElement);
        };
    })
    .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end. */

    function scanQRCode(videoElement) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const scan = () => {
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {

            const info = parseQRCode(code.data)
            const respuesta = confirm(`¿Quieres añadir el producto ${info.producto} a tu carrito?`);
            if(respuesta) {
              const p_actual = carrito.find(p => p.producto === info.producto);
              if (p_actual) {
                p_actual.cantidad++;
              } else {
                carrito.push({producto: info.producto, precio: info.precio, cantidad: 1, favorito: false});
              }
              const email = user.email;
              const accion = "add"
              const data = {email, carrito, accion}
              socket.emit('carrito', data);
            }
            else{
              alert("Producto no añadido");
            }
            
          } else {
              requestAnimationFrame(scan);
          }
      };
      scan();
  }
  function parseQRCode(data) {
    const lines = data.split('\n');
    const info = {};
    lines.forEach(line => {
        const [key, value] = line.split(': ');
        info[key.toLowerCase()] = value;
    });
    console.log(info);
    return info;
}
});

socket.on('carritoResponse', (res) => {
  if (res.ok) {
    if(res.acc === 'add') {
    loadCarrito(carrito);
    alert('Producto añadido al carrito'); 
    }
    else if (res.acc === 'remove'){
      loadCarrito(carrito);
      alert('Producto añadido a favoritos');
    }
    /*else if (res.acc === 'no-fav'){
      console.log("eliminar");
      alert('Producto eliminado de favoritos');
    } */

  } else {
      alert(res.message);
  }
});

function loadCarrito(carrito){
  const productos = document.querySelector('.productos');
  productos.innerHTML = '';
  carrito.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.id = producto.producto;

    const texto = document.createElement('div');
    texto.className = 'texto';
    if(producto.favorito){
      texto.appendChild(document.createElement('h2')).textContent = producto.producto + ' ❤️';
    }
    else{
      texto.appendChild(document.createElement('h2')).textContent = producto.producto;
    }
    
    texto.appendChild(document.createElement('p')).textContent = producto.precio;
    texto.appendChild(document.createElement('p')).textContent = `Cantidad ${producto.cantidad}`;

    div.addEventListener('dblclick', () => {
      favorito(producto, div);
    });

    div.addEventListener('click',() =>{
      window.addEventListener('devicemotion', handleDeviceMotion);

      function handleDeviceMotion(event) {
        const acceleration = event.accelerationIncludingGravity;
        const accelerationThreshold = 15; // Adjust the threshold value as needed

        if (Math.abs(acceleration.x) > accelerationThreshold || Math.abs(acceleration.y) > accelerationThreshold || Math.abs(acceleration.z) > accelerationThreshold) {
          const respuesta = confirm(`¿Quieres eliminar el producto ${producto.producto} del carrito?`);
          if (respuesta) {
            console.log("birrar");
            const index = carrito.findIndex(p => p.producto === producto.producto);            
            if (index !== -1) {
              carrito.splice(index, 1);
              const email = user.email;
              const accion = "remove";
              const data = { email, carrito, accion };
              socket.emit('carrito', data);
            }
          }
        }
      }
    });

    div.appendChild(texto);

    const imagen = document.createElement('img');
    imagen.src = `images/${producto.producto}.png`;
    imagen.alt = producto.producto;
    div.appendChild(imagen);
    productos.appendChild(div);
  });
}

function favorito(producto, div){
  if(!producto.favorito){
      producto.favorito = true;
      const email = user.email;
      const accion = "fav"
      const data = {email, carrito, accion};
      const h2Element = div.querySelector('h2');
      h2Element.textContent = producto.producto + ' ❤️' ;
      socket.emit('carrito', data);
  }
  else{
      producto.favorito = false;
      const email = user.email;
      const accion = "no-fav"
      const data = {email, carrito, accion};
      const h2Element = div.querySelector('h2');
      h2Element.textContent = producto.producto ;
      socket.emit('carrito', data);
  }

}

