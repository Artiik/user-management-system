'use strict';

// require dependencies
const express = require('express'),
      app = express(),
      morgan = require('morgan'),
      cors = require('cors'),
      bodyParser = require('body-parser');

// configure server
app.set('port', process.env.PORT || 8080);
app.set('db_uri', process.env.DB_URI);
app.use(morgan('dev'));
app.use(cors());
// make sure we can get data from forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// // for development only
// if ('development' == app.get('env')) {
//     app.use(express.errorHandler());
// }

// require routes
app.use(require('./routes'));

// export server
module.exports = app;