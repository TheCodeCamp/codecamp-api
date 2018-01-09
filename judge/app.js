
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
const solutions = require('./routes/solution');
app.use('/',solutions)


/*app.post('/problem' , (req,res)=>{
    var body = _.pick(req.body,['code','name','description','input_format','output_format','constraints','input_example','output_example','explanation_example','date_added','timelimit','sourcelimit','author']);
    var problem = new Problem(body);
    problem.save().then((problem) => {
        res.send(problem)
      }, (e) => {
        res.status(400).send(e)
      })
 })*/

const port = process.env.PORT || 3002;
app.listen(port);
console.log('magic is started at ' + port)

module.exports={app}