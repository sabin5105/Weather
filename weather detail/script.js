const options = {
    // Required: API key
    key: 'Gfmo3QA1KzPwsMFABm9AVIPNPbbZqbIp',

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