const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const VerifyToken = require('./../utils/auth/verifyToken');
const { handleValidation } = require('./../utils/validate');
const jwt = require('jsonwebtoken');
const config = require('./../config');
const User = require('./../models/user/user');
const router = express.Router();

const signupRules = [
    body('username').isString().trim().notEmpty(),
    body('email_id').isEmail(),
    body('password').isLength({ min: 6 }),
];

router.post('/signup', signupRules, handleValidation, (req,res)=>{
    const body = _.pick(req.body,['username','email_id','name','college','password','dob','gender','city','bio']);
    body.joinedOn = new Date();
    User.findOne({'username':body.username,'email_id':body.email_id},function(err,user){
        if(err){
            res.send(err)
        }else if(user){
            res.json({
                'success':false,
                'msg':'User with Username Exists'
            })
        }else{
            const newUser = new User(body);
            bcrypt.hash(newUser.password, 10).then(function(hash) {
                newUser.password=hash;
                newUser.save().then((user) => {
                    var token = jwt.sign({ username: user.username},config.jwtSecret, {
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


const signinRules = [
    body('username').isString().trim().notEmpty(),
    body('password').notEmpty(),
];

router.post('/signin', signinRules, handleValidation, (req,res)=>{
    const body = _.pick(req.body,['username','email_id','password']);

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
            let token = jwt.sign({ username: user.username, isAdmin: user.isAdmin },config.jwtSecret, {
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
            let token = jwt.sign({ username: user.username },config.jwtSecret, {
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
    const username = req.params.username;
    console.log(username)
    const body = _.pick(req.body,['username','email_id','name','college','password','dob','gender','city','joinedOn','bio']);
    User.findOneAndUpdate({'username':username},{$set: body}).then((user)=>{
        res.json({
            'success':true,
            'msg':'Profile updated Successfully!'
        })
    }).catch((err)=>{
        res.json({
            'success':false,
            'msg':err
        })
    })

})



module.exports = router; 
