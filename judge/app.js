var cluster = require('cluster');
const cors = require('cors')



// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {
    const express= require('express');
    const morgan = require('morgan');
    const passport = require('passport');
    const flash = require('connect-flash')
    const app = express();


    const mongoose = require('mongoose')

    mongoose.Promise = global.Promise
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/OnlineJudge')

    app.use(cors())
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
    const ide = require('./routes/ide');
    app.use('/',solutions);
    app.use('/ide',ide);

    const port = process.env.PORT || 3001;
    app.listen(port);
    console.log('magic is started at ' + port +'****worker :- ' +cluster.worker.id)

    module.exports={app}
}