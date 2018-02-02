<<<<<<< HEAD
=======
<<<<<<< HEAD
const express = require('express');
const _ = require('lodash')
const db = require('./../utils/db/db');
const Problem = require('./../../contest/models/problem/problem');
const Contest = require('./../../contest/models/contest')
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

router.post('/question' , (req,res)=>{
    var contest = req.body.contest;
    var body = _.pick(req.body,['code','contest','name','successfulSubmission','level','description','input_format','output_format','constraints','input_example','output_example','explanation_example','date_added','timelimit','sourcelimit','author']);
    var problem = new Problem(body);
   // problem.save().then((pro) => {
     //   console.log(pro)
        Contest.findOneAndUpdate({"name":body.contest},{ "$push": { "questions": problem } },(err,con)=>{
            con.questions.push(body)
            res.send(con)
        })

   // })
    
})

router.post('/contest' , (req,res)=>{
    var body = _.pick(req.body,['name','startTime','endTime','description']);
    var contest = new Contest(body);
    contest.save().then((pro) => {
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
=======
>>>>>>> 73a9b1d0a1fabb223c70b50431b009c32cb343a5
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
<<<<<<< HEAD
=======
>>>>>>> aae61357893efc5840f7327a2cce64f575d50d4d
>>>>>>> 73a9b1d0a1fabb223c70b50431b009c32cb343a5
module.exports = router;