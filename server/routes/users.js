<<<<<<< HEAD
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');
const VerifyToken = require('./../utils/auth/verifyToken');
const jwt = require('jsonwebtoken')
const db = require('./../utils/db/db');
const User = require('./../models/user/user');
const router = express.Router();

router.post('/signup',(req,res)=>{
    const body = _.pick(req.body,['username','email_id','name','college','password','dob','gender','city','joinedOn','bio']);
    User.findOne({'username':body.username},function(err,user){
        if(err){
            res.status(404).send(err)
        }else if(user){
            res.status(404).send('User with Username Exists')
        }else{
            var user = new User(body);
            user.save().then((user) => {
                var token = jwt.sign({ username: user.username},'secret', {
                    expiresIn: 86400 // expires in 24 hours
                  });
                  res.status(200).send({ auth: true, token: token });
              }, (e) => {
                res.status(400).send(e)
              })
        }
    })
    
});

router.get('/me', VerifyToken, function(req, res) {
    
    User.findOne({username:req.username}, function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
      });
     
});

router.post('/login',(req,res)=>{
    const body = _.pick(req.body,['username','email_id','password']);
    console.log(`***${body.password} *** ${body.username}`);
    
    User.findByUsername(body.username,body.password,(err,user)=>{
        if(err){
            res.status(404).send(err)
        }else if(!user){
            res.status(404).send('User Not Found')
        }else if(user){
            var token = jwt.sign({ email_id: user.email_id },'secret', {
                expiresIn: 86400 // expires in 24 hours
              });
            res.send(user)
        }
    })
})


function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    } else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    }
  }


module.exports = router; 


=======
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');
const db = require('./../utils/db/db');
const User = require('./../models/user/user');
const router = express.Router();

router.post('/signup',(req,res)=>{
    const body = _.pick(req.body,['username','email_id','name','college','password','dob','gender','city','joinedOn','bio']);
    User.findOne({'username':body.username},function(err,user){
        if(err){
            res.status(404).json({
                "success":false
            })
        }else if(user){
            res.status(404).json({
                "success":false
            })
        }else{
            var user = new User(body);
            user.save().then((user) => {
                res.json({
                    "success":true
                })
              })
        }
    })
    
});

router.post('/login',(req,res)=>{
    const body = _.pick(req.body,['username','password']);
    console.log(`***${body.password} *** ${body.username}`)
    User.findByUsername(body.username,body.password,(err,user)=>{
        if(err){
            res.status(404).json({
                "success":false,
                "msg" : 'Check your conection'
            })
        }else if(!user){
            res.status(404).json({
                "success":false,
                'msg': 'User not found'
            })
        }else if(user){
            res.json({
                "success":true,
                "msg": 'uservalid' 
            })
        }
    })
})


module.exports = router; 


>>>>>>> aae61357893efc5840f7327a2cce64f575d50d4d
