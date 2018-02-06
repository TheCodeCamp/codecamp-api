const express = require('express');
const _ = require('lodash');
const Contest = require('./../../contest/models/contest');
const Problem = require('./../../contest/models/problem/problem')

const router = express.Router();

router.post('/',(req,res)=>{
    const body = _.pick(req.body,['name','startTime','endTime','id','description']);
    const contest = new Contest(body);
    contest
        .save()
        .then((contest)=>{
            res.status(200).json({
                'success':true,
                'msg':'contest added Now You can add problems'
            })
        })
        .catch((err)=>{
            res.status(400).json({
                'success':false,
                'msg':'Error Occured While Adding contest ! please Try Again'
            })
        })

});

router.get('/:id',(req,res)=>{
    const id = req.params.id;
    Contest.findOne({'id':id},(err,contest)=>{
        if(err){
            return res.status(400).json({
                    'success':false,
                    'msg':'Wrong Request'
                })
        }else if(!contest){
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
                'msg':contest
            })
    })
})

router.get('/',(req,res)=>{
    var projection ={
        _id    : false,
        name   : true
    }
    Contest.find({},projection,(err,contest)=>{
        if(err){
            return res.status(400).json({
                    'success':false,
                    'msg':'Wrong Request'
                })
        }else if(!contest){
            return res 
                    .status(404)
                    .json({
                        'success':false,
                        'msg':'Can\'t find any contest'
                    })
        }
        res 
            .status(200)
            .json({
                'success':true,
                'contests':contest
            })
    })
})


router.get('/:id',(req,res)=>{
    const id = req.params.id;
    Contest.findOne({'id':id},(err,contest)=>{
        if(err){
            return res.status(400).json({
                    'success':false,
                    'msg':'Wrong Request'
                })
        }else if(!contest){
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
                'msg':contest
            })
    })
})


// problem routes


router.post('/:id/question' , (req,res)=>{
    const id = req.params.id;
    var body = _.pick(req.body,['code','name','successfulSubmission','level','description','input_format','output_format','constraints','input_example','output_example','explanation_example','date_added','timelimit','sourcelimit','author']);
    var problem = new Problem(body);
   problem.save().then((pro) => {
        Contest.findOneAndUpdate({"id":id},{ "$push": { "questions": problem } },(err,con)=>{
            con.questions.push(body)
            res.send(con)
        })

   })
    
})
module.exports = router;