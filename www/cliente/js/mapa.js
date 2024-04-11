navigator.geolocation.getCurrentPosition(function(position) {
    const userLat = position.coords.latitude;
    const userLong = position.coords.longitude;
    
    // Define los límites de la imagen basándote en la ubicación del usuario
    const imageBounds = [[userLat - 0.05, userLong - 0.05], [userLat + 0.05, userLong + 0.05]];
    
    // Crea el mapa con las opciones de límites y zoom
    const map = L.map('map', {
      center: [userLat, userLong],
      zoom: 14,
      minZoom: 12.5, // El nivel de zoom mínimo permitido
      maxZoom: 18, // El nivel de zoom máximo permitido
      maxBounds: imageBounds, // Los límites máximos del mapa
      maxBoundsViscosity: 1.0, // Hace que el mapa no se pueda mover fuera de los límites
    });
    
    L.imageOverlay('images/mapa.jpg', imageBounds).addTo(map);
    L.marker([userLat, userLong]).addTo(map);
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