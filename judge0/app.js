var cluster = require('cluster');

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

    const port = process.env.PORT || 3000;
    app.listen(port);
    console.log('magic is started at ' + port +'****worker :- ' +cluster.worker.id)

    module.exports={app}
}