var inputval = document.querySelector("#cityinput");
var city = document.querySelector("#cityoutput");
var descrip = document.querySelector("#description");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var time = document.querySelector("#time");

apik = "fb187f9d42c55760eb1770dbbbc44a91"; // api key

function convertion(val) {
  return (val - 273).toFixed(2);
}

window.onload = function () {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q="+window.location.search.slice(10)+"&appid="+apik
  )
    .then((res) => res.json())
    .then((data) => {
      var nameval = data["name"];
      var descrip = data["weather"]["0"]["description"];
      var tempature = data["main"]["temp"];
      var wndspd = data["wind"]["speed"];
      var dt = data["dt"];
      var lat = data["coord"]["lat"];
      var lon = data["coord"]["lon"];
      dt = new Date(dt * 1000);

      console.log(data);


      //   city.innerHTML = `Weather of <span>${nameval}<span>`;
      //   temp.innerHTML = `Temperature: <span>${convertion(tempature)} C</span>`;
      description.innerHTML = `Sky Conditions: <span>${descrip}<span>`;
      //   wind.innerHTML = `Wind Speed: <span>${wndspd} km/h<span>`;
      //   time.innerHTML = `Time: <span>${dt}<span>`;
      coord.innerHTML = `Coordinates: <span>
        <br>
        Latitude: ${lat} <br>
        Longitude: ${lon}<span>`;
    })
    .catch(err => alert('You entered Wrong city name'))
};
