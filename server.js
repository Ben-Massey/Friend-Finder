// Import dependencies.
var express = require('express');

// Initialize app.
var app = express();

// PORT is either the port provided by Heroku via process.env.PORT or 3000.
var PORT = process.env.PORT || 3000;

// Set up middleware.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/app/public'));

// Import routes.
require('./app/routing/apiRoutes')(app);
require('./app/routing/htmlRoutes')(app);

// Start listening.
app.listen(PORT, function() {
    console.log("app listening on Port: " + PORT);
});