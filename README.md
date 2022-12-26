# Weather
Weather application with air flow and news

<hr>

## 2022-2 Advanced Web programming project

* working on the localhost
* reference from [bootstrap](https://getbootstrap.com), [windy](https://api.windy.com)

<hr>

## 실행방법
1. mysql server 실행 - 적절한 db 생성 후
2. app.js 를 node로 실행
3. localhost:3000 으로 접속

* apikey는 임의대로 개인 apikey를 적용했습니다.

## directory 구조
중요한 파일들만 작성
```
├── about
├── account
|  ├── login.html
|  ├── signup.html
├── assets
|  ├── img
|  ├── mp4
|  ├── favicon.ico
├── contact
├── css
├── header
├── news
|  ├── naver_weather.js
├── node_modules
├── sessions
├── subscribe
├── weatherinfo
|  ├── info.js
├── windy
|  ├── script.js
├── app.js : nodejs 실행파일 / 서버 / mysql 연동
├── index.html : 메인 페이지
├── main.html : 메인 페이지 2 / 검색 후
```

## npm install list
* mysql2
* express
* express-session
* session-file-store
* path
* request
* cheerio
* iconv-lite

## examples
<img width="1000" alt="image" src="https://user-images.githubusercontent.com/50198431/209521639-abbecc85-7495-4c4c-8a0d-2df0997d0f58.png">
<img width="1000" alt="image" src="https://user-images.githubusercontent.com/50198431/209521697-954dccbb-09cf-4845-bd24-6cb283b38776.png">
