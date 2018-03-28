const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Contest = require('./../../contest/models/contest/contest');
const Problem = require('./../../contest/models/problem/problem');
const Solution = require('./../models/solution/solution');
const User = require('./../models/user/user');

const problemRoute = require('./problems');

const router = express.Router();

router.post('/',(req,res)=>{
    body = req.body;
    let user = body.user;
    let contest = body.contest;
    let problem = body.problem;
    let id = contest+problem+user;
    console.log(id)
    
    Solution.find({'id':{'$regex':id}},'id username language submitted_on status -_id', (err,sub)=>{
        if(!sub){
            return res.json({
                success:false,
                msg:'You have Not Submiited Anything ! Please Solve a Problem'
            });
        }
        res.json({
            success:true,
            msg:sub
        });
    })
})



module.exports = router;
