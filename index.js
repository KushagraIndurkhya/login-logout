// Constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const MY_SECRET = process.env.MY_SECRET || 'mysecret';

// Setting up the server

var express = require('express'),
    app = express(),
    session = require('express-session'),
    mongoose = require('mongoose');
MongoDbStore = require('connect-mongo');
cookieParser = require("cookie-parser");
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());
app.use(express.json());
app.use(
    session({
        secret: MY_SECRET,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        resave: false,
        saveUninitialized: true,
        store: MongoDbStore.create({
            mongoUrl: MONGODB_URI
        })
    })
);
app.use(express.json());
app.use(express.static(__dirname));
app.use(cookieParser());
//Using routes
app.use('/', require('./routes'));
app.use('/api', require('./api_routes'));

//Connecting to MongoDB
mongoose.connect(MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});


//Starting the Server
app.listen(PORT);
console.log("app running at port " + PORT);