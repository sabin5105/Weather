var inputval = document.querySelector('#cityinput')
var btn = document.querySelector('#add');
var city = document.querySelector('#cityoutput')
var descrip = document.querySelector('#description')
var temp = document.querySelector('#temp')
var wind = document.querySelector('#wind')
var time = document.querySelector('#time')
var kakaoShare = document.querySelector('#kakaotalk-sharing-btn')

apik = "fb187f9d42c55760eb1770dbbbc44a91" // api key

function convertion(val){
    return (val - 273).toFixed(2)
}

btn.addEventListener('click', function(){
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputval.value+'&appid='+apik)
    .then(res => res.json())
    .then(data => {
        var nameval = data['name']
        var descrip = data['weather']['0']['description']
        var tempature = data['main']['temp']
        var wndspd = data['wind']['speed']
        var dt = data['dt']
        var lat = data['coord']['lat']
        var lon = data['coord']['lon']
        dt = new Date(dt*1000)

        city.innerHTML=`Weather of <span>${nameval}<span>`
        temp.innerHTML = `Temperature: <span>${ convertion(tempature)} C</span>`
        description.innerHTML = `Sky Conditions: <span>${descrip}<span>`
        wind.innerHTML = `Wind Speed: <span>${wndspd} km/h<span>`
        time.innerHTML = `Time: <span>${dt}<span>`
        coord.innerHTML = `Coordinates: <span>
        <br>
        Latitude: ${lat} <br>
        Longitude: ${lon}<span>`

    })
    .catch(err => alert('You entered Wrong city name'))
})

kakaoShare.addEventListener('click', function(){
    // TODO:전부다 병합하면 주소 변경해서 추가할 예정
    Kakao.Share.createDefaultButton({
    container: '#kakaotalk-sharing-btn',
    objectType: 'feed',
    content: {
        title: '날씨 정보',
        description: '날씨 정보를 확인하세요',
        imageUrl:
        'https://cdn-icons-png.flaticon.com/512/1669/1669524.png',
        link: {
        // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
        mobileWebUrl: 'http://localhost:3000',
        webUrl: 'http://localhost:3000',
        },
    },
    buttons: [
        {
        title: '웹으로 보기',
        link: {
            mobileWebUrl: 'http://localhost:3000',
            webUrl: 'http://localhost:3000',
        },
        },
        {
        title: '앱으로 보기',
        link: {
            mobileWebUrl: 'http://localhost:3000',
            webUrl: 'http://localhost:3000',
        },
        },
    ],
    });
})