const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const path = require('path');

// mysql connection
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '5105',
    database: 'awp',
	port: 3306
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/account'));
var location = '';


// http://localhost:3000/
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
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
				// Redirect to home page
				response.redirect('/home');
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
		response.send('Welcome back, ' + request.session.username + '!');
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
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		connection.query('SELECT * FROM userTable WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is same user, output the error
			if (results.length > 0) {
				response.send('You are already registered!');
			} else {
				// Execute SQL query that'll select the account from the database based on the specified username and password
				connection.query('INSERT INTO userTable (username, password) VALUES (?, ?)', [username, password], function(error, results, fields) {
					// If there is an issue with the query, output the error
					if (error) throw error;
					// If the account exists
					if (results.length > 0) {
						// Authenticate the user
						request.session.loggedin = true;
						request.session.username = username;
						// Redirect to home page
						response.redirect('/newaccount');
					} else {
						response.send('Incorrect Username and/or Password!');
					}
					response.end();
				});
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.listen(3000);