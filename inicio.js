const iniciar = document.querySelector("#iniciar");

// Lista de usuarios
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

function buscarUsuario(email) {
    // Buscar usuario por email
    const usuario = usuarios.find((usuario) => usuario.email == email);
    return usuario;
}

iniciar.addEventListener("touchend", add => {
    const email = document.getElementById('email_l').value;
    const contraseña = document.getElementById('contrasena_l').value;

    // Buscar usuario por nombre
    /* const usuario = buscarUsuario(email);
    
    // Si no se encuentra el usuario, mostrar una alerta
    if (!usuario) {
        alert('Usuario no encontrado');
        return false;
    }
    
    // Validar contraseña
    if (usuario.contraseña != contraseña) {
        alert('Contraseña incorrecta');
        return false;
    }

    // Guardar usuario en LocalStorage
    localStorage.setItem('usuario', JSON.stringify(usuario)); */

    alert('Login correcto');
    window.location = 'inicio.html';
    return true;
});