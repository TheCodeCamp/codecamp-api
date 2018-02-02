const LocalStrategy = require('passport-local').Strategy;
const User = require('./../../models/user/user')

module.exports = (passport)=>{
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup',new LocalStrategy({
        usernameField:'username',
        passwordField:'password',
        passReqToCallback:true
    },(req,username,password,done)=>{
        process.nextTick(()=>{
            User.findOne({'username':'username'},function (err,user){
                if(err)
                    return done(err);
                if(user){
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                }else{
                    var user = new User();
                    user.username=username;
                    user.password=password

                    user.save( function(err){
                        if (err)
                            throw err;
                        return done(null, newUser);
                    })
                }
            })
        })
    }))
}