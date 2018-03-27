const express = require('express');
const mongoose = require('mongoose');
const Contest = require('./../../contest/models/contest/contest');
const problemRoute = require('./problems');

const router = express.Router();

router.get('/',(req,res)=>{
    const time = Date();
    Contest.find({'endTime':{$lt:time}})
        .then((contest)=>{
            res.json(contest);
        })
})

router.use('/problem',problemRoute)

module.exports = router;