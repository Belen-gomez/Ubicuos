let mapa;
var prodcutos = [];
navigator.geolocation.getCurrentPosition(function (position) {
    
    const userLat = position.coords.latitude;
    const userLong = position.coords.longitude;
  
    // Define los límites de la imagen basándote en la ubicación del usuario
    
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
  
    L.imageOverlay('images/mapa.jpg', imageBounds).addTo(map);
    map.on('click', function (e) {
        alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
        alert("Lat, Lon : " + userLat + ", " + userLong)
    });
    L.marker([userLat, userLong]).addTo(map).bindPopup("Estás aquí");
    prodcutos.push([userLat + 0.07734547799743, userLong- 0.0256704705298106]);
    //fuet: 40,49995027799743, -3,7186240705298106
    //usuario: 40,4226048, -3,6929536
  });

document.getElementById("btn-top").addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const input = document.getElementById("producto")
input.addEventListener("click", function() {
    const opciones = document.getElementsByClassName("opciones");
    for (let i = 0; i < opciones.length; i++) {
        opciones[i].style.display = "block";
    }
/*     opciones.style.display = "block"; */
});
const fuet = document.getElementById("fuet")
fuet.addEventListener("click", function() {
    const opciones = document.getElementsByClassName("opciones");
    for (let i = 0; i < opciones.length; i++) {
        opciones[i].style.display = "none";
    }

    input.value = "Fuet Espetec";
});

const buscar = document.getElementById("btn-buscar");
buscar.addEventListener("click", function() {
    const producto = input.value;
    if(producto===null){
        alert("Selecciona un producto para buscar");
    }
    else if (producto === "Fuet Espetec") {
        L.marker(prodcutos[0]).addTo(map).bindPopup("Fuet Espetec");
        map.setView(prodcutos[0], 13);
    }
});

  /*   var marcadorUsuario= null;
  var watchId = navigator.geolocation.watchPosition(function(position) {
    usuario = [position.coords.latitude, position.coords.longitude];
    if (marcadorUsuario) {
      marcadorUsuario.setLatLng(usuario);
    }
    else{
      marcadorUsuario = L.marker(usuario).addTo(map).bindPopup("Estás aquí")
    }
    calcularDistancia();
  
    //Si se está mostrando la ruta la quitamos porque al moverse irá avanzando
    if(rutaLinea){
      ocultarRuta();
    }
  }); */