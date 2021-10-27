const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI
var express = require('express'),
    app = express(),
    session = require('express-session'),
    mongoose = require('mongoose');
MongoDbStore = require('connect-mongo');
cookieParser = require("cookie-parser");


app.use(express.urlencoded());
app.use(express.json());
app.use(
    session({
        secret: 'my-random-secret',
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
app.use('/', require('./routes'));


mongoose.connect(MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});



app.listen(PORT);
console.log("app running at port " + PORT);