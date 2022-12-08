const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const path = require('path');
const request = require("request");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

// mysql connection
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'cometrue',
    database: 'awp',
	port: 3306
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
	store: new fileStore()
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/account'));
app.use(express.static(__dirname + '/weatherInfo'));
app.use(express.static(__dirname + '/weatherDetail'));
app.use(express.static(__dirname + '/news'));

// http://localhost:3000/
app.get('/', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
		response.sendFile(path.join(__dirname + '/my.html'));
	} else {
	response.sendFile(path.join(__dirname + '/index.html'));
	}
});

// http://localhost:3000/main
app.get('/main', function(request, response) {
	// get url
	url = request.url;
	if(url.indexOf('?') != -1){
		location = url.split('?')[1].split('=')[1];
	}
	response.sendFile(path.join(__dirname + '/main.html'), {location: location});
});

// http://localhost:3000/my
app.get('/my', function(request, response) {
	response.sendFile(path.join(__dirname + '/my.html'));
});

// http://localhost:3000/login
app.get('/login', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/account/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM userTable WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to the index page
				response.redirect('/my');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send();
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

// http://localhost:3000/newaccount
app.get('/newaccount', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('You have a problems with sign up! Maybe you are already registered with the same name?');
	}
	response.end();
});

// http://localhost:3000/signup
app.get('/signup', function(request, response) {
	// Render signup template
	response.sendFile(path.join(__dirname + '/account/signup.html'));
});

// http://localhost:3000/signauth
app.post('/signauth', function(request, response) {
	let username = request.body.username;
	let password = request.body.password;
	
	if (username && password) {
		connection.query('INSERT INTO userTable (username, password) VALUES (?, ?)', [username, password], function(error, results, fields) {
			if (error) throw error;
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/login');

			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get("/naver_weather", (req, res) => {
  
	request(
	  {
		url: "https://weather.naver.com/news/",
		method: "GET",
		encoding: null,
	  },
	  (error, response, body) => {
		if (error) {
		  console.error(error);
		  return;
		}
		if (response.statusCode === 200) {
		  console.log("response ok");
		  const bodyDecoded = iconv.decode(body, "utf-8");
		  const $ = cheerio.load(bodyDecoded);
  
		  img_class = "thumb";
		  title_class = "tit_news";
		  document_class = "dsc_news";
  
		  // get top 10 news
		  news = [];
		  for (let i = 1; i < 11; i++) {
			img = $("." + img_class).eq(i).attr("src");
			title = $("." + title_class).eq(i).text();
			document = $("." + document_class).eq(i).text();
			news.push({
			  img: img,
			  title: title,
			  document: document,
			});
		  }
		  console.log(news);
		  res.send(news);
		}
	  }
	);
  });


app.listen(3000);