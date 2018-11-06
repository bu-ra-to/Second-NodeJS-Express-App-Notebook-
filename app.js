const express = require('express');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

// LOad User Model
require('./models/Users')

// Passport Config
require('./config/passport')(passport);

// Loading Routes
const auth = require('./routes/auth');

// Loading Keys
const keys = require('./config/keys');

/// Mongo connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('mongo connected'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send("Hello Again Ivan")
});

//Express-session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

//Cookie-parser middleware
app.use(cookieParser())

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

/// Set Global Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})


// Use Routes
app.use('/auth', auth);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listenning port ${port}`)
})