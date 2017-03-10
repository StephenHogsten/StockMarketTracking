'use strict';

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, (err) => {
  // eslint-disable-next-line
  if (err) console.log('mongoose connection error: ' + err);
});

// initialize app
const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(__dirname + '/public'));

var sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
};
if (process.env.ENV_TYPE === 'PRODUCTION') {
  sessionOptions.cookie = { secure: true };
  app.set('trust proxy', 1);
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
  // res.send('testme');
});

app.use((req, res) => {
  res.status(404).send('no route was found');
});

const port = process.env.PORT;
app.listen(port || 3000, () => {
  // eslint-disable-next-line
  console.log('listening on port ' + (port || 3000));
});
