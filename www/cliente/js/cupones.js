window.onload = async () => {
    let usuario;
    try {
        const response = await fetch('/getUser');
        if (!response.ok) {
            throw new Error('No has iniciado sesión');
        }
        const user = await response.json();
        document.title = `¡Bienvenido ${user.nombre}!`;
        usuario = user;
    } catch (error) {
        console.error('Error:', error);
    }
    alert(usuario);
};