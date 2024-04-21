let mapa;
var prodcutos = [];
var marcadorUsuario = null;

//La posición del usuario es siempre la entrada de la tienda. Esto se ha conseguido centrando los límites del mapa. Si el usuario se mueve también se mueve su marcador.
//Los productos salen siempre en las mismas posicones del mapa. Esto se hace poniendo los productos en función de la posición del usuario

navigator.geolocation.getCurrentPosition(function (position) {

    const userLat = position.coords.latitude;
    const userLong = position.coords.longitude;

    // Define los límites de la imagen basándose en la ubicación del usuario
    const imageBounds = [[userLat - 0.005, userLong - 0.07], [userLat + 0.095, userLong + 0.03]];

    // Crea el mapa con las opciones de límites y zoom
    map = L.map('map', {
        center: [userLat, userLong],
        zoom: 13,
        minZoom: 12.5, // El nivel de zoom mínimo permitido
        maxZoom: 18, // El nivel de zoom máximo permitido
        maxBounds: imageBounds, // Los límites máximos del mapa
        maxBoundsViscosity: 1.0, // Hace que el mapa no se pueda mover fuera de los límites
    });

    // Agrega la imagen al mapa
    L.imageOverlay('images/mapa.jpg', imageBounds).addTo(map);
    marcadorUsuario = L.marker([userLat, userLong]).addTo(map).bindPopup("Estás aquí");

    // Agrega productos
    //Fuet
    prodcutos.push([userLat + 0.07734547799743, userLong - 0.0256704705298106]);
    //Ordenador
    prodcutos.push([userLat + 0.03712678880546, userLong - 0.061397254568599]);
    //Camiseta
    prodcutos.push([userLat + 0.02397186664462, userLong - 0.051270567152715]);
});

var watchId = navigator.geolocation.watchPosition(function (position) {
    const userLat = position.coords.latitude;
    const userLong = position.coords.longitude;

    // Actualiza la posición del marcador del usuario
    if (marcadorUsuario) {
        marcadorUsuario.setLatLng([userLat, userLong]);
    } else {
        marcadorUsuario = L.marker([userLat, userLong]).addTo(mapa).bindPopup("Estás aquí");
    }
});

document.getElementById("btn-top").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

//Se puede seleccionar uno de los tres produtos y al pulsar en el botón de mostrará en el mapa
const input = document.getElementById("producto")
input.addEventListener("click", function () {
    const opciones = document.getElementsByClassName("opciones");
    for (let i = 0; i < opciones.length; i++) {
        opciones[i].style.display = "block";
    }
});

const fuet = document.getElementById("fuet")
const ordenador = document.getElementById("ordenador")
const camiseta = document.getElementById("camiseta")

fuet.addEventListener("click", function () {
    const opciones = document.getElementsByClassName("opciones");
    for (let i = 0; i < opciones.length; i++) {
        opciones[i].style.display = "none";
    }
    input.value = "Fuet Espetec";
});

ordenador.addEventListener("click", function () {
    const opciones = document.getElementsByClassName("opciones");
    for (let i = 0; i < opciones.length; i++) {
        opciones[i].style.display = "none";
    }
    input.value = "Ordenador";
});

camiseta.addEventListener("click", function () {
    const opciones = document.getElementsByClassName("opciones");
    for (let i = 0; i < opciones.length; i++) {
        opciones[i].style.display = "none";
    }
    input.value = "Camiseta";
});

const buscar = document.getElementById("btn-buscar");
buscar.addEventListener("click", function () {
    const producto = input.value;
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker && layer !== marcadorUsuario) {
            map.removeLayer(layer);
        }
    });

    if (producto === "Fuet Espetec") {
        L.marker(prodcutos[0]).addTo(map).bindPopup("Fuet Espetec");
        map.setView(prodcutos[0], 13);
    }
    if (producto === "Ordenador") {
        L.marker(prodcutos[1]).addTo(map).bindPopup("Ordenador");
        map.setView(prodcutos[1], 13);
    }
    if (producto === "Camiseta") {
        L.marker(prodcutos[2]).addTo(map).bindPopup("Camiseta");
        map.setView(prodcutos[2], 13);
    }
});

