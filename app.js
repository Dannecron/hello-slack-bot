#!/usr/bin/env node

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

const helloBot = require('./hello.js');

const app = express();
const sslPath = process.env.SSL_CERT_PATH;

const options = {
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

const server = https.createServer(options, app);

server.listen(443, function () {
  console.log('start server. Listening for port 443')
});
