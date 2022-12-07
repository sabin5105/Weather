apik = "fb187f9d42c55760eb1770dbbbc44a91" // api key

let lat= 37.57002838826;
let lon= 126.97962084516;

fetch('https://api.openweathermap.org/data/2.5/weather?q='+window.location.search.split('=')[1]+'&appid='+apik)
.then(res => res.json())
    .then(data => {
        lat = data['coord']['lat']
        lon = data['coord']['lon']

        const options = {
            // Required: API key
            key: 'Gfmo3QA1KzPwsMFABm9AVIPNPbbZqbIp',

            // Put additional console output
            verbose: true,

            // seoul    
            lat: lat,
            lon: lon,
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
    })
