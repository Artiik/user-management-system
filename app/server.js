'use strict';
require('dotenv').config();

// require dependencies
const express = require('express'),
      app = express(),
      morgan = require('morgan'),
      cors = require('cors'),
      bodyParser = require('body-parser');

const mongoose = require('mongoose');

// configure server
app.set('port', process.env.PORT || 8080);
app.set('db_uri', process.env.DB_URI);

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

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

// connect to database
mongoose.connect(app.get('db_uri'), () => {
    if (process.env.NODE_ENV !== 'test') {
        console.log('Database connected!\n', app.get('db_uri'));
    }
});

// export server
module.exports = app;