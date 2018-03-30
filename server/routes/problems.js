const express = require('express');
const _ = require('lodash')
//const db = require('./../utils/db/db');
const Problem = require('./../../contest/models/problem/problem');
const Contest = require('./../../contest/models/contest/contest');
const commentRoute = require('./comments.js');
const router = express.Router({mergeParams: true})

router.get('/:code',(req,res)=>{
    var code= req.params.code;
    Problem.findOne({'code':code})
    .select('code score name  successfulSubmission level  image contest description  input_format  output_format constraints   input_example   output_example   explanation_example  date_added   timelimit   sourcelimit   author   testCaseInput   testCaseOutput')
    .then((problem)=>{
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


router.patch('/:code/edit',(req,res)=>{
    const code = req.params.code;
   // console.log(username);
    var body = _.pick(req.body,['code','name','successfulSubmission','level',,'image','contest','description','input_format','output_format','constraints','input_example','output_example','explanation_example','date_added','timelimit','sourcelimit','author','testCaseInput','testCaseOutput']);
    Problem.findOneAndUpdate({'code':code},{$set: body}).then((problem)=>{
        res.json({
            'success':true,
            'msg':'Problem updated Successfully!'
        })
    }).catch((err)=>{
        res.json({
            'success':false,
            'msg':err
        })
    })

})

router.delete('/:code',(req,res)=>{
    const code = req.params.code;
    Problem.findOneAndRemove({'code':code}).then(()=>{
        res.json({
            'success':true,
            'msg':'Problem deleted Successfully!'
        })
    }).catch((err)=>{
        res.json({
            'success':false,
            'msg':'Error Occurred Please try Again'
        })
    })
});
router.use('/',commentRoute);
module.exports = router;