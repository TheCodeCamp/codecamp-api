const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const _ = require('lodash');
const Contest = require('./../../../contest/models/contest/contest');
const Problem = require('./../../../contest/models/problem/problem');
const Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        minlength:1,
        required:true

    },
    email_id:{
        type:String,
        unique:true,
        minlength:4,
        required:true
    },
    password:{
        type:String,
        minlength:8,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    dob:{
        type:Date
    },
    name:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    joinedOn:{
        type:Date,
        default:(new Date())

    },
    bio:{
        type:String,
        default:""
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    contest:[{
        name:{
            type:mongoose.Schema.Types.String,
            refs:'Contest'
        },
        problemSolved:[{
            name:{
            type:mongoose.Schema.Types.String,
            refs:'Problem'
            },
            submissionTime:{
                type:Date
            },
            WA:[{
                count:{
                    type:Number,
                    default:0
                },
                submissionTime:{
                    type:Date
                }
            }],
            RE:[{
                count:{
                    type:Number,
                    default:0
                },
                submissionTime:{
                    type:Date
                }
            }],
            TLE:[{
                count:{
                    type:Number,
                    default:0
                },
                submissionTime:{
                    type:Date
                }
            }]

        }],
        count:{
            type:Number,
            default:0
        }
    }]
});


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
    return _.pick(userObject,['email_id','_id','college','name','bio','dob','joinedOn','username','city','gender'])
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
                }else if(!res){
<<<<<<< HEAD
                    return done(err);
                }else if(res){
                    return done(null,user);
=======
                    return done(err)
                } else if(res){
                    return done(null,user)
>>>>>>> 2cc704141c7f90f47465c9318ad6508d35a021e3
                }
            })
        }
    })
}

module.exports = mongoose.model("User",UserSchema)