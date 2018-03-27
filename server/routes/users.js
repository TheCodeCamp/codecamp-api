const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');
const bcrypt = require('bcryptjs')
const VerifyToken = require('./../utils/auth/verifyToken');
const jwt = require('jsonwebtoken');
const User = require('./../models/user/user');
const router = express.Router();

router.post('/signup',(req,res)=>{
    const body = _.pick(req.body,['username','email_id','name','college','password','dob','gender','city','joinedOn','bio']);
    body.joinedOn= (new Date).toLocaleString();
    User.findOne({'username':body.username,'email_id':body.email_id},function(err,user){
        if(err){
            res.send(err)
        }else if(user){
            res.json({
                'success':false,
                'msg':'User with Username Exists'
            })
        }else{
            var user = new User(body);
            bcrypt.hash(user.password, 10).then(function(hash) {
                user.password=hash;
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
                    res.json({
                        'success':false,
                        'msg':e
                    })
                  })
                
            }).catch((e)=>{
                res.json({
                    'success':false,
                    'msg':e
                })
            });
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


router.post('/signin',(req,res)=>{
    const body = _.pick(req.body,['username','email_id','password']);
    console.log(`***${body.password} *** ${body.username}`);
    
    User.findByUsername(body.username,body.password,(err,user)=>{
        if(err){
            console.log(err)
            res.json({
                'success':false,
                'msg':err
            })
        }else if(!user){
            res.json({
                'success':false,
                'msg':'User not found'
            })
        }else if(user.isAdmin===true){
            let token = jwt.sign({ username: user.username, isAdmin: user.isAdmin },'secret', {
                expiresIn: 86400 // expires in 24 hours
              });
            res.json({
                'success':true,
                'msg':'Successfully logged In',
                'token': token,
                'user': {
                    username: user.username,
                    isAdmin:user.isAdmin
                  }
            }) 
        }
        else if(user){
            let token = jwt.sign({ username: user.username },'secret', {
                expiresIn: 86400 // expires in 24 hours
              });
            res.json({
                'success':true,
                'msg':'Successfully logged In',
                'token': token,
                'user': {
                    username: user.username,
                    isAdmin: user.isAdmin
                  }
            })
        }

    })
})

router.patch('/:username/edit',(req,res)=>{
    let username = req.params.username;
    username = username.substr(1);
    // console.log(username);
    // const body = _.pick(req.body,['username','email_id','name','college','password','dob','gender','city','joinedOn','bio']);
    const body = _.pick(req.body,['name','college','dob','gender','city','joinedOn']);
    
    User.findOne({'username':username}).then((model) => {
       // console.log(model);
        return Object.assign(model, body);
    }).then((model) => {
        return model.save();
    }).then((updatedModel) => {
        res.json({
            'success':true, 
            'msg':'Profile updated Successfully!'
        })
    }).catch((err) => {
        res.json({
            'success':false,
            'msg':'User Not Found :('
        })
    });
})



module.exports = router; 
