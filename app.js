const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

const port = 3000;

//DB
const db = require('./config/database');
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.log(`MongoDB ERROR ${err}`);
});

//STATIC DIR
app.use(express.static('public'));

//TEMPLATE ENGINE
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//BODY PARSER
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
//SESSION
app.use(session({
    secret: 'satlink2018',
    resave: true,
    saveUninitialized: true,

}));

//PASSPORT

app.use(passport.initialize());
app.use(passport.session());

app.use((flash()));


// require('./config/passport')(passport);
var UserManager = require('./coreLib/DataAccess/UserManager.js');

require('./models/users');
var userModel = mongoose.model('users');
var UserManagerObj = new UserManager(userModel);
UserManagerObj.login(passport);


//GLOBAL variables MIDDLEWARE
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.locals.success_msg = req.flash('Success msg');
    res.locals.error_msg = req.flash('Error msg');
    // req.locals.error = req.flash('error') || null;
    res.locals.user = req.user || null;
    next();
})

//ROUTES ( static )

app.get('/', (req, res) => {
    res.render('landing');
})
app.get('/about', (req, res) => {
    res.render('about');
})
app.get('/contact-us', (req, res) => {
    res.render('contact-us');
})

//ROUTES
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
app.use('/users', userRoutes);
app.use('/admin',adminRoutes);

//SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});