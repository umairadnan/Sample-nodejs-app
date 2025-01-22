var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    serveStatic = require('serve-static'),
    expressValidator = require('express-validator'),
    passport = require('passport'),
    crypto = require('crypto'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    morgan = require('morgan');

var handlebars = require('express-handlebars').create({
    layoutsDir: "views/layouts",
    partialsDir: "views/partials",
    defaultLayout: 'main'
});

// Initialize express framework
var app = express();

app.use(morgan('dev')); // log every request to the console

// Use environment variable for MongoDB URI, defaulting to localhost if not defined
var mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/samplenodejsapp';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
});

require('./src/middleware/passport')(passport);

app.use(cookieParser('SampleNode.jsApp')); // read cookies
app.use(cookieSession({
    keys: ['key1', 'key2']
}));

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('views', __dirname + '/views'); // set template directory
app.set('view engine', 'handlebars'); // set view engine to handlebars
app.engine('handlebars', handlebars.engine);
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(serveStatic('./public')); // serve static files from public directory
app.use(flash()); // used to display flash messages from sessions

require('./routes')(app, passport); // include routes
app.listen(process.env.PORT || 3000);

console.log('Listening on port 3000');
