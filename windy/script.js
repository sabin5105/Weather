const options = {
    // Required: API key
    key: '',

    // Put additional console output
    verbose: true,

    // seoul    
    lat: 37.57002838826,
    lon: 126.97962084516,
    zoom: 5,
};

// Initialize Windy API
windyInit(options, windyAPI => {

    const { map } = windyAPI;
    // .map is instance of Leaflet map

    // L.popup()
    //     .setLatLng([options.lat, options.lon])
    //     .setContent('Here you are!')
    //     .openOn(map);

    setLatLng([options.lat, options.lon]);
    openOn(map);
});


var x = document.getElementById("location");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
}
