'use strict';

const express = require('express');
const app = express(); //creating instance of express and calling it 'app'
const bodyParser = require('body-parser');

app.use(express.static('./public'));//add to serve up static pages

app.use(bodyParser.json()); //this must go here before the routes!!

const messages = require('./routes/messages');

app.use('/messages',messages); //mounting path to messages -- anytime anyone hits /messages, will redirect them to any route in messages.js file

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
