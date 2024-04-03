const registro = document.querySelector("#registro");

registro.addEventListener("touchend", add => {

    function registrar_usuario(email, nombre, contraseña){
        let nuevo_registro = ""
    }
    // Obtener datos del formulario
    const nombre = document.getElementById('nusuario').value;
    const contraseña = document.getElementById('contrasena').value;
    const conf_contraseña = document.getElementById('contrasena2').value;
    const email = document.getElementById('email').value;

    // Validar nombre de usuario
    if (nombre == '') {
        alert('Por favor, ingrese su nombre de usuario');
        return false;
    }

    // Validar correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert('Formato de correo electrónico inválido');
        return false;
    }

    // Validar contraseña
    if (contraseña == '') {
        alert('Por favor, ingrese una contraseña');
        return false;
    }
    // Validar confirmación de contraseña
    if(contraseña != conf_contraseña){
        alert('Las contraseñas no coinciden');
        return false;
    }

    alert('Formulario enviado correctamente');

    window.location = 'inicio.html';
    return true;
});