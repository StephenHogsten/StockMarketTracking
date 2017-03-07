'use strict';

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

// require some components

mongoose.Promise = global.Promise;
// mongoose.connect()

const app = express();

app.use(bodyParser);


const port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log('listening on port ' + (port || 3000));
});