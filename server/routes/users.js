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
            res.status(404).send(err)
        }else if(user){
            res.status(404).send('User with Username Exists')
        }else{
            var user = new User(body);
            user.save().then((user) => {
                res.send(user)
              }, (e) => {
                res.status(400).send(e)
              })
        }
    })
    
});

router.post('/login',(req,res)=>{
    const body = _.pick(req.body,['username','password']);
    console.log(`***${body.password} *** ${body.username}`)
    User.findByUsername(body.username,body.password,(err,user)=>{
        if(err){
            res.status(404).send(err)
        }else if(!user){
            res.status(404).send('User Not Found')
        }else if(user){
            res.send(user)
        }
    })
})


module.exports = router; 


