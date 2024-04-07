const NodeWebcam = require("node-webcam");

// Crea una instancia de NodeWebcam con la configuración deseada
const webcam = NodeWebcam.create({
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: false,
    output: "jpeg",
    device: false,
    callbackReturn: "base64"
});

// Función para tomar una foto desde la cámara y decodificar el código QR
function tomarFotoYDecodificarQR() {
    webcam.capture("foto", (err, data) => {
        if (err) {
            console.error("Error al tomar la foto:", err);
            return;
        }
        // Decodificar el código QR de la imagen
        decodificarCodigoQR(data);
    });
}

// Función para decodificar el código QR
function decodificarCodigoQR(imageData) {
    const imagen = imageData.replace(/^data:image\/jpeg;base64,/, "");
    const Buffer = require("buffer").Buffer;
    const buffer = Buffer.from(imagen, "base64");

    const jsQR = require("jsqr");
    const code = jsQR(buffer, 1280, 720);
    if (code) {
        console.log("Código QR encontrado:", code.data);
        // Aquí puedes hacer lo que quieras con el código QR decodificado
    } else {
        console.log("No se encontró ningún código QR en la imagen.");
    }
}

// Llama a la función para tomar una foto y decodificar el código QR
tomarFotoYDecodificarQR();
/* document.addEventListener("DOMContentLoaded", function() {
    const activarCamaraBtn = document.getElementById("camara");
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    //const context = canvas.getContext("2d");

    activarCamaraBtn.addEventListener("click", async function() {
        try {
            // Solicitar acceso a la cámara
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            // Mostrar la vista previa de la cámara
            video.srcObject = stream;
            video.style.display = "block";
            video.play();

            // Mostrar el lienzo para capturar la imagen
            canvas.style.display = "block";

            // Capturar imagen cuando se hace clic en la vista previa de la cámara
            video.addEventListener("click", function() {
                capturarImagen();
            });
        } catch (error) {
            console.error("Error al acceder a la cámara:", error);
        }
    });

    function capturarImagen() {
        // Configurar el tamaño del lienzo para que coincida con el tamaño del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Capturar imagen del video en el lienzo
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convertir la imagen en una URL de datos
        const imageDataURL = canvas.toDataURL("image/jpeg");

        // Decodificar el código QR de la imagen
        decodificarCodigoQR(imageDataURL);
    }

    function decodificarCodigoQR(imageDataURL) {
        // Convertir la URL de datos en una imagen para decodificar el código QR
        const imagen = new Image();
        imagen.onload = function() {
            // Decodificar el código QR de la imagen
            const code = jsQR(imagen, imagen.width, imagen.height);
            if (code) {
                console.log("Código QR encontrado:", code.data);
                // Aquí puedes hacer lo que quieras con el código QR decodificado
            } else {
                console.log("No se encontró ningún código QR en la imagen.");
            }
        };
        imagen.src = imageDataURL;
    }
}); */
/* //const jsQR = require('jsqr');
const camara = document.getElementById('camara');
camara.addEventListener('click', () => {
    var video = document.createElement('video');
    video.style.display = 'block';
    
    // Prefer camera resolution nearest to 1280x720.
    var constraints = { audio: false, video: {facingMode: "environment" } }; 
    
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
            video.play();
            scanQRCode(video);
        };
    })
    .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
    
    document.body.appendChild(video);
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
} */