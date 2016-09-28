require('dotenv').config();

// bootstrap our app

const mongoose = require('mongoose');

// require server
const app = require('./app/server');

// connect to database
mongoose.connect(app.get('db_uri'), () => {
    console.log('Database connected!\n', app.get('db_uri'));
});

// start server
app.listen(app.get('port'), function () {
    console.log('App is listening on port: ' + app.get('port') + '\n');
});