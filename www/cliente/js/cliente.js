const socket = io();
const iniciar = document.querySelector("#iniciar");

iniciar.addEventListener("click", add => {
    add.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(email==''){
        alert('Ingrese un correo');
        return;
    }

    if(password==''){
        alert('Ingrese una contraseña');
        return;
    }

    const data =  {email, password };
    
    socket.emit('login', data);
});

socket.on('loginResponse', (res) => {
    if (res.ok) {
        alert('Inicio de sesión exitoso');
        window.location.href = "carrito.html";
    } else {
        alert(res.message);
    }
});

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
const registro = document.querySelector("#registro");

registro.addEventListener("touchend", add => {
    // Obtener datos del formulario
    const minombre = document.getElementById('nusuario').value;
    const mipassword = document.getElementById('contrasena').value;
    const miconf_password = document.getElementById('contrasena2').value;
    const miemail = document.getElementById('email').value;

    // Validar nombre de usuario
    if (minombre == '') {
        alert('Por favor, ingrese su nombre de usuario');
        return false;
    }

    // Validar correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(miemail)) {
        alert('Formato de correo electrónico inválido');
        return false;
    }

    // Validar contraseña
    if (miconf_password == '') {
        alert('Por favor, ingrese una contraseña');
        return false;
    }
    // Validar confirmación de contraseña
    if(mipassword != miconf_password){
        alert('Las contraseñas no coinciden');
        return false;
    }

    const data = { email: miemail, password: mipassword, nombre: minombre };
    const json = JSON.stringify(data);
    fetch('/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en el registro');
        }
        return response.text();
    })
    .then(message => {
        alert('Registro exitoso');
        window.location.href = "carrito.html";
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en el registro');
    });
    
});