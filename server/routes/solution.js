<<<<<<< HEAD
=======
<<<<<<< HEAD
const express = require('express');
const _ = require('lodash');
const rp = require('request-promise')
const http = require('http')
const fs = require('fs')
const app= require('./../../server/app')
const mongoose = require('mongoose')
const request = require('request')
const multer = require('multer')
const db = require('./../utils/db/db');
const Solution = require('./../models/solution/solution');
const router = express.Router();

var upload  = multer({dest:'solutions/'})
var originalname = 'solution';
var judge = 0; 
//const noOfJudge =2; //number of judge working
router.post('/',upload.single(originalname),async (req,res)=>{
    if (req.file) {
      var count =await Solution.getObjcount(req.body.username,req.body.code);
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
          var opt ={uri:`http://localhost:300${judge}/${sol.id}`,
          agent:httpAgent,
          json:true
          };
         // judge=(judge+1)%noOfJudge;
          rp(opt).then((body)=>{
            res.send(body)
          }).catch((e)=>{
            console.log(e);
            res.send(e)
          })
      }).catch((e)=>{
          //console.log(e);
          res.send(e)
      })
    }
})


module.exports = router;
=======
>>>>>>> 73a9b1d0a1fabb223c70b50431b009c32cb343a5
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
      var count =await Solution.getObjcount(req.body.username,req.body.code);
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
          var opt ={uri:`http://localhost:3002/${sol.id}`,
          agent:httpAgent,
          json:true
          };
          rp(opt).then((body)=>{
            console.log(body)
            judge=3;
            res.send(body)
          }).catch((e)=>{
            console.log(e);
            res.send(e)
          })
      }).catch((e)=>{
          //console.log(e);
          res.send(e)
      })
    }
})


module.exports = router;
<<<<<<< HEAD
=======
>>>>>>> aae61357893efc5840f7327a2cce64f575d50d4d
>>>>>>> 73a9b1d0a1fabb223c70b50431b009c32cb343a5
