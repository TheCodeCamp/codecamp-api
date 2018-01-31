const express = require('express');
const _ = require('lodash')
const db = require('./../utils/db/db');
const Problem = require('./../models/problem/problem');
const router = express.Router();

router.post('/' , (req,res)=>{
    var body = _.pick(req.body,['code','name','successfulSubmission','level','description','input_format','output_format','constraints','input_example','output_example','explanation_example','date_added','timelimit','sourcelimit','author']);
    var problem = new Problem(body);
    problem.save().then((pro) => {
        res.send(pro)
      }, (e) => {
        res.status(400).send(e)
      })
})

router.get('/',(req,res)=>{
    Problem.find({}).then((result)=>{
        res.send(result);
    }).catch((e)=>{
        res.status(400)
    })
})
/*router.get('/:id',(req,res)=>{
    var id= req.params.id;
    if(mongoose.Types.ObjectId(id)){
        Problem.findById(id).then((result)=>{
            res.send(result)
        }).catch((e)=>{
            res.status(400)
        })
    }

})*/
router.get('/:code',(req,res)=>{
    var code= req.params.code;
    Problem.findOne({'code':code}).then((result)=>{
        res.send(result)
    }).catch((e)=>{
        res.status(400)
    })
})

router.get('/level/:level',(req,res)=>{
    var level= req.params.level;
    Problem.find({'level':level}).then((result)=>{
        res.send(result)
    }).catch((e)=>{
        res.status(400)
    })
})
module.exports = router;