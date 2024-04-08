var user;
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

const socket = io();
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
            /* const info = parseQRCode(code.data);
            const respuesta = confirm(`¿Quieres añadir el producto ${info.producto} a tu carrito?`);
            if(respuesta) {
              console.log("añadir");
              fetch('/addProduct', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  id: user.email,
                  producto: info.producto
                })
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('No se pudo añadir el producto');
                }
                alert('Producto añadido');
              })
              .catch(error => {
                console.error('Error:', error);
                alert('Producto no añadido');
              });
            }
            else{
              alert('Producto no añadido');
            } */
            const info = parseQRCode(code.data)
            const respuesta = confirm(`¿Quieres añadir el producto ${info.producto} a tu carrito?`);
            if(respuesta) {
              
              const producto = document.createElement('div');
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
              document.body.appendChild(producto);
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

/* function scanQRCode(video) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d', {willReadFrequently: true});
    
    
    setInterval(function() {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        var imageData = context.getImageData(0, 0, video.videoWidth, video.videoHeight);
        
        // Attempt to decode the QR code
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          } );
        if (code) {
            console.log("Found QR code", code.data);
        }
    }, 1000);
} 
 */