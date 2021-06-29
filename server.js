'use strict';

const express = require('express');
// var mongo = require('mongodb');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const healthcheckRoutes = require('./domains/healthcheck/routes');
app.use('/api', healthcheckRoutes);

const shortUrlRoutes = require('./domains/short-url/routes');
app.use('/api/shorturl', shortUrlRoutes);

app.listen(port, function () {
  console.log('Node.js listening ...');
});