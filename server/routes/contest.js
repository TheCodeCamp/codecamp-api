const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Contest = require('./../../contest/models/contest/contest');
const Problem = require('./../../contest/models/problem/problem');
const problemRoute = require('./problems')
const practice = require('./practice');

const router = express.Router();

router.post('/',(req,res)=>{
    const body = _.pick(req.body,['name','startTime','endTime','id','description']);
    const contest = new Contest(body);
    contest
        .save()
        .then((contest)=>{
            fs.mkdir(__dirname+'/../../judge/result/input/'+contest.id,(err)=>{
                if(err){
                    res.status(400).json({
                        'success':false,
                        'msg':'Error Occured While input Creating Folder'
                    })
                }
            })
            fs.mkdir(__dirname+'/../../judge/result/output/'+contest.id,(err)=>{
                if(err){
                    res.status(400).json({
                        'success':false,
                        'msg':'Error Occured While output Creating Folder'
                    })
                }
            })
            res.status(200).json({
                'success':true,
                'msg':'contest added ,Now You can add problems'
            })
        })
        .catch((err)=>{
            res.status(400).json({
                'success':false,
                'msg':err
            })
        })

});

router.use('/:id/problems',problemRoute)


router.get('/:id',(req,res)=>{
    const id = req.params.id;
    // var Projection={
    //     _id:false,
    //     'questions.name':true,
    //     'questions.code':true

    // }
    Contest.find({'id':id}).
        populate({
            path: 'questions',
            select:['name','code','successfulSubmission','users'],
            model: 'Problem'
        }).
        exec(function(err,question){
            if(err){
                return res.status(400).json({
                        'success':false,
                        'msg':'Wrong Request'
                    })
            }else if(!question){
                return res 
                        .status(404)
                        .json({
                            'success':false,
                            'msg':'Can\'t find any contest with given id'
                        })
            }          
            // let abc={}; 
            // for(let i=0)
            // console.log(abc);
            const abc = question.map(x=>{
                let result = [];
                let name=x.name;
                let startTime=x.startTime;
                let endTime=x.endTime;
                let id= x.id;
                let description=x.description;

                //console.log(x.questions.length);
                
               for(let i=0;i<x.questions.length;i++)
                {
                    //console.log(i);
                    result.push({
                        "successfullSubmission":x.questions[i].users.length,
                        "name": x.questions[i].name,
                        "code": x.questions[i].code
                    });

                }
               
               return {'questions':result,'name':name,'id':id,'startTime':startTime,'endTime':endTime,'description':description}
            });
            res 
                .status(200)
                .json({
                    'success':true,
                    'msg':abc
                })
        })
})
    
router.delete('/:id', (req,res) => {
    res.json({
        'success':true,
        'msg': 'Deleted Successfully'
    })
})

router.get('/',(req,res)=>{
    var projection ={
        _id    : false,
        name   : true,
        id : true,
        startTime: true,
        endTime: true,
        description: true
    }
    let time = Date();
    Contest.find({endTime:{$gt:time}},projection,(err,contest)=>{
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


// problem routes


router.post('/:id' , (req,res)=>{
    const id = req.params.id;
    let body = _.pick(req.body,['code','name','successfulSubmission','image','level','score','contest','description','input_format','output_format','constraints','input_example','output_example','explanation_example','date_added','timelimit','sourcelimit','author']);
    let testCaseInput = req.body.testCaseInput;
    body.contest = id;
    let testCaseOutput = req.body.testCaseOutput;
    var problem = new Problem(body);
   problem.save().then((pro) => {

       fs.writeFile(__dirname+'/../../judge/result/input/'+id+'/'+pro.code+'.txt',testCaseInput,(err)=>{
           if(err){
                return res
                    .json({
                        'success':false,
                        'msg':'Error Occured While writing Input test Cases'
                    })
            }
        })

       fs.writeFile(__dirname+'/../../judge/result/output/'+id+'/'+pro.code+'.txt',testCaseOutput,(err)=>{
            if(err){
                return res
                    .json({
                        'success':false,
                        'msg':'Error Occured While writing Output test Cases'
                    })
            }
        })
        
        Contest.findOneAndUpdate({"id":id},{ "$push": { "questions": problem._id } },(err,con)=>{
           //console.log(con) 
            //con.questions.push(body)
            res.status(200)
            .json({
                'success':true,
                'problem':problem
            })
        })
   })
})
module.exports = router;