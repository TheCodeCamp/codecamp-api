const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Contest = require('./../../contest/models/contest/contest');
const Problem = require('./../../contest/models/problem/problem');
const problemRoute = require('./problems')

const router = express.Router();

router.post('/',(req,res)=>{
    const body = _.pick(req.body,['name','startTime','endTime','id','description']);
    const contest = new Contest(body);
    contest
        .save()
        .then((contest)=>{
            fs.mkdir(__dirname+'/../../judge/result/input/'+contest.id,(err)=>{
                if(err){
                    return res.status(400).json({
                        'success':false,
                        'msg':'Error Occured While input Creating Folder'
                    })
                }
            })
            fs.mkdir(__dirname+'/../../judge/result/output/'+contest.id,(err)=>{
                if(err){
                    return res.status(400).json({
                        'success':false,
                        'msg':'Error Occured While output Creating Folder'
                    })
                }
            })
            return res.status(200).json({
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
            select:['name','code'],
            model: 'Problem'
        }).
        exec(function(err,question){
            console.log(err)
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
            
            res 
                .status(200)
                .json({
                    'success':true,
                    'msg':question
                })
        })
    })
        
        


router.get('/',(req,res)=>{
    var projection ={
        _id    : false,
        name   : true,
        id : true
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


// problem routes


router.post('/:id' , (req,res)=>{
    const id = req.params.id;
    var body = _.pick(req.body,['code','name','successfulSubmission','level','contest','description','input_format','output_format','constraints','input_example','output_example','explanation_example','date_added','timelimit','sourcelimit','author','testCaseInput','testCaseOutput']);

    var problem = new Problem(body);
   problem.save().then((pro) => {

       fs.writeFile(__dirname+'/../../judge/result/input/'+id+'/'+pro.code+'.txt',pro.testCaseInput,(err)=>{
           if(err){
                return res
                    .json({
                        'success':false,
                        'msg':'Error Occured While writing Input test Cases'
                    })
            }
        })

       fs.writeFile(__dirname+'/../../judge/result/output/'+id+'/'+pro.code+'.txt',pro.testCaseOutput,(err)=>{
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