const express = require('express');
const _ = require('lodash');
const rp = require('request-promise')
const http = require('http')
const fs = require('fs')
const app= require('./../../server/app')
const mongoose = require('mongoose')
const request = require('request')
const multer = require('multer')
const encode = require('./../utils/encoding');
const db = require('./../utils/db/db');
const Solution = require('./../models/solution/solution');
const router = express.Router();

var upload  = multer({dest:'solutions/'})
var originalname = 'solution';
router.post('/',upload.single(originalname),async (req,res)=>{
    var solution;
     if(req.file){
      var count =await Solution.getObjCount(req.body.username,req.body.contest,req.body.problem)+1;
      solution = new Solution({ 
        problem:req.body.problem,
        contest:req.body.contest,
        username:req.body.username,
        id:req.body.contest+req.body.problem+req.body.username+count,
        language:req.body.language.toLowerCase(),
        description:new Buffer(fs.readFileSync(req.file.path)).toString('base64'),
        submitted_on:new Date() 
      });
    }
       
    else if (!req.file) {
      var count =await Solution.getObjCount(req.body.username,req.body.contest,req.body.problem)+1;
      solution = new Solution({ 
          problem:req.body.problem,
          contest:req.body.contest,
          username:req.body.username,
          id:req.body.contest+req.body.problem+req.body.username+count,
          language:req.body.language.toLowerCase(),
          description:req.body.description.toString('base64'),
          submitted_on:new Date() 
        });
    }

        solution.save().then((sol) => {
          const agentOptions = new Object();
          agentOptions.keepAliveMsecs = 6000;
          agentOptions.maxSockets = 5;
          agentOptions.maxFreeSockets = 5;
          const httpAgent = new http.Agent(agentOptions);
          var opt ={uri:`http://localhost:3001/${sol.id}`,
          agent:httpAgent,
          json:true
          };
          rp(opt).then((body)=>{
            res.json({
              "success":true,
              "msg":body
            })
          }).catch((e)=>{
            console.log(e);
            res.json({
              "success":false,
              "msg":e
            })
          })
      }).catch((e)=>{
          res.json({
            "success":false,
            "msg":e
          })
      })
    }
)


module.exports = router;
