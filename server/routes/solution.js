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
    if (req.file) {
      var count =await Solution.getObjCount(req.body.username,req.body.code)+1;
      console.log(count)
      var solution = new Solution({ 
          code:req.body.code,
          username:req.body.username,
          id:req.body.code+req.body.username+count,
          language:req.body.language.toLowerCase(),
          description:new Buffer(fs.readFileSync(req.file.path)).toString('base64'),
          submitted_on:new Date() 
        });
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
            console.log(body)
            judge=3;
            res.json({
              "success":true,
              "msg":body
            })
          }).catch((e)=>{
            console.log(e);
            res.json({
              "success":false
            })
          })
      }).catch((e)=>{
          //console.log(e);
          res.json({
            "success":false
          })
      })
    }
})


module.exports = router;
