const options = {
    // Required: API key
    key: 'Gfmo3QA1KzPwsMFABm9AVIPNPbbZqbIp', // REPLACE WITH YOUR KEY !!!

    // Put additional console output
    verbose: true,

    // Optional: Initial state of the map
    lat: 37.57002838826,
    lon: 126.97962084516,
    zoom: 5,
};

// Initialize Windy API
windyInit(options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff

    const { map } = windyAPI;
    // .map is instance of Leaflet map

    L.popup()
        .setLatLng([options.lat, options.lon])
        .setContent('Here you are!')
        .openOn(map);
});