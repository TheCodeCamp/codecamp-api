
const express= require('express');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash')
const app = express();

const bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     
    extended: true
}));

const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: "Shh, its a secret!",
    proxy: true,
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
//Routes
const problems = require('./routes/problems');
const users = require('./routes/users');
const solutions = require('./routes/solution');
app.use('/problem', problems);
app.use('/users', users);
app.use('/solution',solutions)

var judge=2;

const port = process.env.PORT || 3000;
app.listen(port);
console.log('magic is started at ' + port)

module.exports={app}