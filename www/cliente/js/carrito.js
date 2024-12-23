var user;
var carrito = [];


const socket = io();

window.onload = async () => {
    try {
        user = JSON.parse(localStorage.getItem('usuario'));
        document.title = `¡Bienvenido ${user.nombre}!`;

        // Al cargar la página primero se obtiene el carrito que tiene el usuario guardado
        carrito = user.carrito;
        loadCarrito(carrito);
    } catch (error) {
        console.error('Error:', error);
    }
};

function scanQRCode(videoElement, containerVideo) {
    //Se utuliza el módulo jsQR
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const scan = () => {
        //escanea la pantalla buscando códigos QR
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            //Si encuentra un código QR lo parsea y pregunta si se quiere añadir el producto al carrito
            const info = parseQRCode(code.data)
            const respuesta = confirm(`¿Quieres añadir el producto ${info.producto} a tu carrito?`);
            if (respuesta) {
                //Se añade el producto tanto al carrito como a la base de datos
                const p_actual = carrito.find(p => p.producto === info.producto);
                //Comprueba si ya está el producto en el carrito. Si está se suma la cantidad, sino se añade desde 0 a la lista
                if (p_actual) {
                    p_actual.cantidad++;
                } else {
                    //Todos los productos son diccionarios que tienen el nombre del producto, el precio, la cantidad y si está marcado como favorito o no
                    carrito.push({ producto: info.producto, precio: info.precio, cantidad: 1, favorito: false });
                }
                //Para añadirlo a la base de datos se manda al socket y el servidor lo añadirá
                const email = user.email;
                const accion = "add"
                const data = { email, carrito, accion }
                socket.emit('carrito', data);
            }
            else {
                //Si no no se hace nada
                alert("Producto no añadido");
            }
            containerVideo.remove();
        } else {
            //Si no encuentra ningún QR sigue buscando
            requestAnimationFrame(scan);
        }
    };
    scan();
}
function parseQRCode(data) {
    //Esta función es para obtener la información de los QR. Los QR que se pueden escanear están el la carpeta QR. Todos tienen esta estructura:
    //Producto: nombre
    //Precio: precio_del_producto
    const lines = data.split('\n');
    const info = {};
    lines.forEach(line => {
        const [key, value] = line.split(': ');
        info[key.toLowerCase()] = value;
    });
    return info;
}
const camara = document.getElementById('camara');

camara.addEventListener('click', () => {
    //Cuando se da al botón de la cámara se abre para poder escanear productos
    const containerVideo = document.createElement('div');
    containerVideo.className = 'container-video';

    const videoElement = document.createElement('video');
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('playsinline', '');
    videoElement.className = 'video-camara';

    //Botón para cerrar la camara
    const botonCerrar = document.createElement('div');
    botonCerrar.textContent = '✖️';
    botonCerrar.className = 'boton-cerrar';

    botonCerrar.addEventListener('click', () => {
        containerVideo.remove();
    });

    containerVideo.appendChild(videoElement);
    containerVideo.appendChild(botonCerrar);
    document.body.appendChild(containerVideo);

    var constraints = { audio: false, video: { facingMode: "environment" } };

    //Esta función para abrir la cámara necesita que la pégina sea considerada como segura. No se puede abrir la cámara en páginas que no sean seguras
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {
            //Si se puede abrir la cámara se llama a la función que escanéa códigos QR
            videoElement.srcObject = mediaStream;
            videoElement.onloadedmetadata = function (e) {
                videoElement.play();
                scanQRCode(videoElement, containerVideo);
            };
        })
        .catch(function (err) { console.log(err.name + ": " + err.message); }); //Errores por si no se puede abrir la cámara
});


//Cada vez que se modifica el carrito la respuesta del servidor llega aquí.
//Lo hemos hecho de esta forma para que no haya que crear distintas funciones cuando se modiifca el carrtio, ya que en el servidor se hace siempre lo mismo
//Al mandar los datos al servidor se manda también la acción que se está haciendo, y en la respuesta del servidor también se recoge.
//De esta forma se pueden hacer diferentes funciones dependiendo de la acción que se hacía sobre el carrito
socket.on('carritoResponse', (res) => {
    if (res.ok) {
        if (res.acc === 'add') {
            //Cuando se añade un producto hay que llamar a al función de loadCarrito     
            loadCarrito(carrito);
            alert('Producto añadido al carrito');
        }
        else if (res.acc === 'remove') {
            alert('Producto eliminado');
            //No hace falta volver a cargar el carrito porque ya se ha eliminado
        }
        //Si no ha habido ningún error también se modifica el usuario en localStorage. Se hace aquí por si hay algún error modificando el usuario en el servidor, que no se modifique en locarStorage
        user.carrito = carrito;
        localStorage.setItem('usuario', JSON.stringify(user));
    } else {
        alert(res.message);
    }
});

function loadCarrito(carrito) {
    //Esta función carga el carrito en la página. Se hace un bucle que genera todos los elementos del carrito
    const productos = document.querySelector('.productos');
    productos.innerHTML = '';

    //Para seleccionar y mover productos
    let productoSeleccionado = null;
    let handleDeviceMotion = null;

    carrito.forEach(producto => {
        //Se crea el div
        const div = document.createElement('div');
        div.className = 'producto';
        div.id = producto.producto;

        //Se añade todo el texto que va en función del producto
        const texto = document.createElement('div');
        texto.className = 'texto';
        if (producto.favorito) {
            texto.appendChild(document.createElement('h2')).textContent = producto.producto + ' ❤️';
        }
        else {
            texto.appendChild(document.createElement('h2')).textContent = producto.producto;
        }

        texto.appendChild(document.createElement('p')).textContent = producto.precio;
        texto.appendChild(document.createElement('p')).textContent = `Cantidad ${producto.cantidad}`;
        texto.lastChild.id = 'cantidad';

        const t_ordenar = document.createElement('p');
        t_ordenar.className = 'oculto';
        t_ordenar.textContent = 'Arrastra para ordenar';
        texto.appendChild(t_ordenar);

        const t_eliminar = document.createElement('p');
        t_eliminar.className = 'oculto';
        t_eliminar.textContent = 'Agita para eliminar';
        texto.appendChild(t_eliminar);
        div.appendChild(texto);

        //Se añade la imagen de cada producto
        const imagen = document.createElement('img');
        imagen.src = `images/${producto.producto}.png`;
        imagen.alt = producto.producto;
        div.appendChild(imagen);
        productos.appendChild(div);

        //Si se pulsa dos veces en el prodcuto se cambia su estado de favorito
        div.addEventListener('dblclick', () => {
            favorito(producto, div);
        });

        div.addEventListener('touchstart', (event) => {
            //Cuando se pulsa sobre un producto se selecciona. Solo puede haber un prodcuto seleccionado a la vez. Por lo tanto, si había algún producto seleccionado se quita
            if (productoSeleccionado !== null) {
                productoSeleccionado.style.backgroundColor = '#E6E5E5';
                productoSeleccionado = null;
                window.removeEventListener('devicemotion', handleDeviceMotion);
            }

            //Se cambia el estilo del prodcuto seleccionado
            div.style.backgroundColor = '#007D55';
            productoSeleccionado = div;

            let touchStartY = event.touches[0].clientY; // Guardar la posición inicial del toque para poder coprobar si se esta deslizando el producto

            //Se comprueba si se esta desplazando un objeto.
            //Esto se hace una vez que ya se ha seleccionado el producto, solo se puede desplazar el producto seleccionado
            div.addEventListener('touchmove', ordenar);


            //funcion que ordena los productos, se llama cuando se desplaza el producto seleccionado
            function ordenar(event) {
                //Para que al desplazar hacia abajo no se recargue la página, que es el comportamiento por defecto
                event.preventDefault()

                //Se comprueba la posicioón final del dedo y se calcula la difrencia entre el inicio y el final. Se obtiene también la altura del div del prodcuto
                const touchEndY = event.touches[0].clientY;
                const deltaY = touchEndY - touchStartY;
                const productHeight = div.offsetHeight;

                // Obtener el índice del producto seleccionado
                const selectedIndex = Array.from(div.parentElement.children).indexOf(div);

                // Calcular el nuevo índice después del arrastre en función de la altura del div, para comporbar que se ha arratrado hasta cambiar la posición del producto
                let newIndex = selectedIndex + Math.round(deltaY / productHeight);

                // Limitar el índice dentro de los límites del contenedor por si se ha desplazado mucho
                newIndex = Math.max(0, Math.min(newIndex, div.parentElement.children.length - 1));

                // Mover el elemento seleccionado a la nueva posición
                if (newIndex !== selectedIndex) {
                    if (newIndex < selectedIndex) {
                        div.parentElement.insertBefore(div, div.parentElement.children[newIndex]);
                    } else {
                        div.parentElement.insertBefore(div, div.parentElement.children[newIndex + 1]);
                    }
                    // Mover el elemento en la lista del carrito
                    const item = carrito.splice(selectedIndex, 1)[0];
                    carrito.splice(newIndex, 0, item);
                    const email = user.email;
                    const accion = 'ordenar';
                    //Se actualiza el carrito en la base de datos. Si todo va bien se actualizará después en LocalStorage
                    socket.emit('carrito', { email, carrito, accion });
                    touchStartY = touchEndY; // Actualizar la posición inicial del toque para el siguiente movimiento
                }
                // Actualizar el índice del producto seleccionado
                productoSeleccionado = div;
            }

            //Funcion para comprobar si se agita el movil. Cuando se selecciona un producto se empiza a comprobar si se agita el dispositivo. Entonces se llama a esta función
            let shakes = 0;

            handleDeviceMotion = function (event) {
                const acceleration = event.accelerationIncludingGravity;
                const accelerationThreshold = 25; // Umbral de aceleración para considerar un movimiento como un agitado

                //Se calcula si se ha agitado el movil en funcion del umbral
                if (Math.abs(acceleration.x) > accelerationThreshold || Math.abs(acceleration.y) > accelerationThreshold || Math.abs(acceleration.z) > accelerationThreshold) {
                    //La variabel de shakes es para que se tenga que agitar mas de una vez el movil. Sino pusieramos esta condición  cada vez que se moviera una vez el móvil rápido se consideraría que se está agitando.
                    //No queremos eso porque se podría borrar un producto sin querer. Se tiene que agitar el movil 3 veces para que se pueda borrar el producto.
                    shakes++;
                    if (shakes >= 3) {
                        const respuesta = confirm(`¿Quieres eliminar el producto ${producto.producto} del carrito?`);
                        if (respuesta) {
                            const index = carrito.findIndex(p => p.producto === producto.producto);
                            if (index !== -1) {
                                if(producto.cantidad>1){
                                    //Si hay más de un producto se resta uno a la cantidad
                                    producto.cantidad--;
                                    div.querySelector('#cantidad').textContent = `Cantidad ${producto.cantidad}`;
                                }
                                else{
                                    //Si solo había un producto se elimina del carrito
                                    carrito.splice(index, 1);
                                    div.remove();
                                }
                                //Se actualiza el producto en la base de datos
                                const email = user.email;
                                const accion = "remove";
                                const data = { email, carrito, accion };
                                shakes = 0;
                                socket.emit('carrito', data);
                            }

                        }
                        else {
                            //Si no se quiere borrar se deja de seleccionar el producto
                            shakes = 0;
                            productoSeleccionado.style.backgroundColor = '#E6E5E5';
                            productoSeleccionado = null;
                        }
                        //Se deja de comprobar si se agita el movil. Si no hacemos esto lo que pasa es que cuando se agite el movil se detectaría el evento de borrar para todos los productos que se han seleccionado alguna vez.
                        //No queremos eso, queremos que solo se detecte el evento de agitar para el producto que está seleccionado.
                        window.removeEventListener('devicemotion', handleDeviceMotion);
                    }
                }
            };
            window.addEventListener('devicemotion', handleDeviceMotion);
            div.addEventListener('touchend', () => {
                //Cuando se deja de pulsar la pantalla también terminar el evento de ordenar
                div.removeEventListener('touchmove', ordenar);
            });
        });
    });
}

function favorito(producto, div) {
    if (!producto.favorito) {
        producto.favorito = true;
        const email = user.email;
        const accion = "fav"
        const data = { email, carrito, accion };
        const h2Element = div.querySelector('h2');
        h2Element.textContent = producto.producto + ' ❤️';
        socket.emit('carrito', data);
    }
    else {
        producto.favorito = false;
        const email = user.email;
        const accion = "no-fav"
        const data = { email, carrito, accion };
        const h2Element = div.querySelector('h2');
        h2Element.textContent = producto.producto;
        socket.emit('carrito', data);
    }
}

