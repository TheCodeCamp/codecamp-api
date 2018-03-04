
const express= require('express');
const morgan = require('morgan');
const passport = require('passport');
const helmet = require('helmet')
const flash = require('connect-flash')
const cors = require('cors')
const app = express();

const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/OnlineJudge')

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
const contest = require('./routes/contest');
const users = require('./routes/users');
const solutions = require('./routes/solution');
const rankings = require('./routes/ranking');
app.use('/contest', contest);
app.use('/users', users);
app.use('/solution',solutions);
app.use('/rankings',rankings);
app.get('/',(req,res)=>{
  res.send('Hello')
})

const port = process.env.PORT || 3000;
app.listen(port);
console.log('magic is started at ' + port)

module.exports={app}
