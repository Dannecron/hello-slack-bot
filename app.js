#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');

var helloBot = require('./hello.js');

var app = express();
var sslPath = '/etc/letsencrypt/live/sao.twilightparadox.com/';

var options = {  
    key: fs.readFileSync(sslPath + 'privkey.pem'),
    cert: fs.readFileSync(sslPath + 'fullchain.pem')
};

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) { res.status(200).send('it works!') });

app.post('/hello', helloBot);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

var server = https.createServer(options, app);  
var io = require('socket.io').listen(server);
server.listen(443, function () {
  console.log('start server. Listening for port 443')
});