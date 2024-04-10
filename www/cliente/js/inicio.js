
const iniciar = document.querySelector("#iniciar");

iniciar.addEventListener("click", add => {
    add.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email == '') {
        alert('Ingrese un correo');
        return;
    }

    if (password == '') {
        alert('Ingrese una contraseña');
        return;
    }

    const data = { email, password };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data, null)
    })

        .then(response => {
            if (response.ok) {
                return response.json();  // Convertir la respuesta a JSON
            } else {
                throw new Error('Error al iniciar sesión');
            }
        })
        .then(usuario => {
            alert('Inicio de sesión exitoso');
            localStorage.setItem('usuario', JSON.stringify(usuario));  // Guardar el usuario en el almacenamiento local
            window.location.href = "carrito.html";
        })
        .catch(error => console.error('Error:', error));
});



