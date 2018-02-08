const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const User = require('./user.json');

var UserSchema = new mongoose.Schema(User);
UserSchema.pre('save',function(next) {
    var user =this;
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
         user.password=hash
         next();
      });
    });
  })

UserSchema.methods.toJSON = function() {
    var user = this ;
    var userObject = user.toObject();
    return _.pick(userObject,['email_id','_id','college','name','dob','bio','joinedOn','username','city','gender'])
}

UserSchema.statics.findByUsername=function(username,password,done){
    var User = this;
    User.findOne({'username':username},(err,user)=>{
        if(err){
            return done(err)
        }else if(!user){
            return done(null,null);
        }else{
            bcrypt.compare(password, user.password, function(err , res){
                if(err){
                    return done(err);
                }else if(res){
                    return done(null,user)
                }
            })
        }
    })
}

module.exports = mongoose.model("User",UserSchema)