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
    //const data =  {email, password };
    fetch('/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({}, null)
    })
    .then(response => {
        if (response.ok) {
        return response.json();
        } else {
        throw new Error('Error en la petición');
        }
    })
    .then(data => {
        const usuario = data.find(user => user.email === email);
        if (!usuario) {
        alert('El correo no está registrado');
        return;
        }
        // Verifica si la contraseña coincide
        if (usuario.password !== password) {
        alert('Contraseña incorrecta');
        return;
        }
        alert('Inicio de sesión exitoso');
        window.location.href = "carrito.html";
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en el registro');
    });
});




        /* body: JSON.stringify(data, null)
    })
    
    .then(response => {
        if (response.ok) {
            alert('Inicio de sesión exitoso');
            window.location.href = "carrito.html";
        } else {
            response.text().then(message => alert(message));
        }
    })
    .catch(error => console.error('Error:', error));
}); */