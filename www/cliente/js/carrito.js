var user;
const socket = io();
window.onload = async () => {
    try {
      const response = await fetch('/getUser');
      if (!response.ok) {
        throw new Error('No has iniciado sesión');
      }
      user = await response.json();
      document.title = `¡Bienvenido ${user.nombre}!`;
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
              const data = {email: user.email, producto: info}
              socket.emit('carrito', data);
              
              /* const producto = document.createElement('div');
              producto.className = 'producto';
              producto.id = info.producto;

              const texto = document.createElement('div');
              texto.className = 'texto';
              texto.appendChild(document.createElement('h2')).textContent = info.producto;
              texto.appendChild(document.createElement('p')).textContent = info.precio;
              texto.appendChild(document.createElement('p')).textContent = 'Cantidad 1';
              producto.appendChild(texto);

              const imagen = document.createElement('img');
              imagen.src = "images/" + info.producto + ".png";
              imagen.alt = info.producto;
              producto.appendChild(imagen);
              document.body.appendChild(producto); */
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
    return info;
}
});

socket.on('carritoResponse', (res) => {
  if (res.ok) {
    console.log(res.carrito);
    loadCarrito(res.carrito);
    alert('Producto añadido al carrito'); 

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
    texto.appendChild(document.createElement('h2')).textContent = producto.producto;
    texto.appendChild(document.createElement('p')).textContent = producto.precio;
    texto.appendChild(document.createElement('p')).textContent = `Cantidad ${producto.cantidad}`;
    div.appendChild(texto);

    const imagen = document.createElement('img');
    imagen.src = `images/${producto.producto}.png`;
    imagen.alt = producto.producto;
    div.appendChild(imagen);
    productos.appendChild(div);
  });
}
