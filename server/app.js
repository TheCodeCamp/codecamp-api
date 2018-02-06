
const express= require('express');
const morgan = require('morgan');
const passport = require('passport');
const helmet = require('helmet')
const contest = require('./../contest/models/contest')
const flash = require('connect-flash')
const cors = require('cors')
const app = express();



const bodyParser = require('body-parser');
app.use(cors())
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     
    extended: true
}));

const cookieParser = require('cookie-parser');
const session = require('cookie-session');

app.use(morgan('dev'));
var expiryDate = new Date(Date.now() + 60 * 60 * 1000)
app.use(session({
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'localhost:3000',
      expires: expiryDate
    }
  }))

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.use(helmet());
//Routes
const problems = require('./routes/problems');
const users = require('./routes/users');
const solutions = require('./routes/solution');
app.use('/problem', problems);
app.use('/users', users);
app.use('/solution',solutions)

const port = process.env.PORT || 3000;
app.listen(port);
console.log('magic is started at ' + port)

module.exports={app}
