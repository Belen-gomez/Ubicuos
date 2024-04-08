window.onload = async () => {
    try {
      const response = await fetch('/getUser');
      if (!response.ok) {
        throw new Error('No has iniciado sesión');
      }
      const user = await response.json();
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
});

function scanQRCode(video) {
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
