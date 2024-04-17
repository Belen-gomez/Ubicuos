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
    if (mipassword != miconf_password) {
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
        if (response.ok) {
            return response.json();  // Convertir la respuesta a JSON
        } else {
            return response.json().then(error => {
                throw new Error(error.error); // Lanzar el mensaje de error recibido del servidor
            });
        }
    })
    .then(usuario => {
        alert('Registro exitoso');
        localStorage.setItem('usuario', JSON.stringify(usuario));  // Guardar el usuario en el almacenamiento local
        window.location.href = "carrito.html";
    })
    .catch(error => alert(error)); // Mostrar el mensaje de error en el alert
    
});