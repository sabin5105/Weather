function getData() {
    fetch("/naver_weather")
      .then((response) => response.json())
      .then((news) => {
        console.log(news);
      });
  }
  
  window.onload = function () {
    getData();
    setInterval(getData, 1000 * 60 * 10); // 10분마다 실행
  };