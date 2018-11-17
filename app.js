const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override')
const passport = require('passport');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

// LOad Models
require('./models/Users');
require('./models/Stories')

// Passport Config
require('./config/passport')(passport);

// Loading Routes
const index = require('./routes/index');
const stories = require('./routes/stories');
const auth = require('./routes/auth');

// Loading Keys
const keys = require('./config/keys');

/// Mongo connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('mongo connected'))
    .catch(err => console.log(err))

//Express-session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

// Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override
app.use(methodOverride('_method'));

//Handlebars Helpers
const { truncate, stripTags, formatDate, select, editIcon } = require('./helpers/hbs')

// Handlebars middleware
app.engine('handlebars', exphbs({
    helpers: { truncate: truncate, stripTags: stripTags, formatDate: formatDate, select: select, editIcon: editIcon },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))


// Use Routes
app.use('/', index);
app.use('/stories', stories);
// app.use('/dashboard', index);
app.use('/auth', auth);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listenning port ${port}`)
})