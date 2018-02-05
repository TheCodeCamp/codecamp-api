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
    User.findOne({'username':body.username,'email_id':body.email_id},function(err,user){
        if(err){
            res.status(404).send(err)
        rs}else if(user){
            res.status(404).json({
                'success':false,
                'msg':'User with Username Exists'
            })
        }else{
            var user = new User(body);
            user.save().then((user) => {
                var token = jwt.sign({ username: user.username},'secret', {
                    expiresIn: 86400 // expires in 24 hours
                  });
                  res.status(200).json({
                    'success':true,
                    'msg':'Registration successful , Now you can Login',    
                    'token':token
                })
              }, (e) => {
                res.status(400).json({
                    'success':false,
                    'msg':e
                })
              })
        }
    })
    
});



router.get('/profile', VerifyToken, function(req, res) {
    
    User.findOne({username:req.username}, function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send("No user found.");
        res.status(200).json({
            'success':true,
            'msg':user
        });
      });
     
});


router.get('/profile/me', VerifyToken, function(req, res) {
    
    User.findOne({username:req.username}, function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send("No user found.");
        res.status(200).json({
            'success':true,
            'msg':user,
            'abd':'gdhd'
        });
      });
     
});

router.post('/signin',(req,res)=>{
    const body = _.pick(req.body,['username','email_id','password']);
    console.log(`***${body.password} *** ${body.username}`);
    
    User.findByUsername(body.username,body.password,(err,user)=>{
        if(err){
            res.status(404).json({
                'success':false,
                'msg':err
            })
        }else if(!user){
            res.status(404).json({
                'success':false,
                'msg':'User not found'
            })
        }else if(user){
            var token = jwt.sign({ username: user.username },'secret', {
                expiresIn: 86400 // expires in 24 hours
              });
            res.json({
                'success':true,
                'msg':'Successfully logged In',
                'token': token,
                'user': {
                    username: user.username
                  }
            })
        }
    })
})



module.exports = router; 
