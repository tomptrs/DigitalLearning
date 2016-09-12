/**
* @file server.js
* @brief server.js is nodig voor de opstart van de server
*
*
* @author Tom Peeters
*
* @date 6/29/2016
*/ 

var express = require("express");
var bodyparser = require("body-parser");

var app = express();
app.use(bodyparser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var path = require('path');
app.use(express.static(__dirname + '/Client')); 
var port = process.env.PORT || 80;// set our port

var gebruikers = require('./router/gebruikers.js');
var vragen = require('./router/vragen.js');
var lessen = require('./router/lessen.js');

app.use('/gebruikers', gebruikers);
app.use('/vragen', vragen);
app.use('/lessen', lessen);

/**
*
*Test function
*/
app.get("/api/users",function(req,res){

    var personen = [
        {
            "naam":"Peeters",
            "voornaam":"Tom"

        },
        {
            "naam":"Vandeperre",
            "voornaam": "Mieke"
        }
    ];

    res.json(personen);
});

/*
SEND HOMEPAGE
*/
app.get("/",function(req,res){
    res.sendFile(path.join(__dirname + '/Client/start.html'));
});

app.listen(port);