const iniciar = document.querySelector("#iniciar");

iniciar.addEventListener("touchend", add => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = { email, password };
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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