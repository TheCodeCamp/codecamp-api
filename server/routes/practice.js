const express = require('express');
const mongoose = require('mongoose');
const Contest = require('./../../contest/models/contest/contest');
const problemRoute = require('./problems');

const router = express.Router();

router.get('/',(req,res)=>{
    const time = Date();
    Contest.find({'endTime':{$lt:time}})
        .populate({
            path: 'questions',
            select:['name','code'],
            model: 'Problem'
        }).
        exec(function(err,question){
            if(err){
                console.log(err);
                return res.status(400).json({
                        'success':false,
                        'msg':err
                    })
            }else if(!question){
                return res 
                        .status(404)
                        .json({
                            'success':false,
                            'msg':'Can\'t find any contest with given id'
                        })
            }
            
            res 
                .status(200)
                .json({
                    'success':true,
                    'msg':question.map(result => {return result.questions } )
                })
        })
})

router.use('/problem',problemRoute)

module.exports = router;