const express = require('express');
const _ = require('lodash')
const db = require('./../utils/db/db');
const Problem = require('./../../contest/models/problem/problem');
const Contest = require('./../../contest/models/contest')
const router = express.Router({mergeParams: true})

router.get('/:code',(req,res)=>{
    var code= req.params.code;
    Problem.findOne({'code':code}).then((problem)=>{
        res.json({
            "success":true,
            "problem":problem
        })
    }).catch((e)=>{
        res.status(400).json({
            "success":false,
            "msg":"Error Occured! Page could not be found"
        })
    })
})


router.get('/',(req,res)=>{
    res
        .status(404)
        .json({
            "success":false,
            "msg":"Error Occured! Page could not be found"
        })
})


module.exports = router;