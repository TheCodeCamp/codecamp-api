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
    Solution.find({'id':req.body.id},'description -_id',(err,solution)=>{
        if(err){
            res.json({
                'success':false,
                'msg':"Error Occured Please Try Again!"
            })
        }
        res.json({
            'success':true,
            'msg':solution
        })
    });
})

module.exports = router;