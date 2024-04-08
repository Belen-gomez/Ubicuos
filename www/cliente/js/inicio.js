
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

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data, null)
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
    });
    
    
    /* socket.emit('login', data);
});

socket.on('loginResponse', (res) => {
    if (res.ok) {
        alert('Inicio de sesión exitoso');
        window.location.href = "carrito.html";
    } else {
        alert(res.message);
    }
});
 */


        