var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    propertiesReader = require('properties-reader');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(app.get('port'), function() {
    console.log("Server is listening on port " + server.address().port);
});
