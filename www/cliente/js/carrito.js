const socket = io();
const camara = document.getElementById('camara');
camara.addEventListener('click', () => {
    var video = document.createElement('video');
    video.style.display = 'block';
    
    var constraints = { audio: false, video: {facingMode: "environment" } }; 

    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
            video.play();
            scanQRCode(video);
        };
    })
    .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end. */
    
    document.body.appendChild(video);
});
function scanQRCode(video) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d', {willReadFrequently: true});
    
    
    setInterval(function() {
        console.log("hola");
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

let carrito = [];

