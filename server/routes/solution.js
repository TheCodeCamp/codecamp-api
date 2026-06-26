const express = require('express');
const rp = require('request-promise')
const http = require('http')
const fs = require('fs')
const multer = require('multer')
const { body } = require('express-validator');
const config = require('./../config');
const { handleValidation } = require('./../utils/validate');
const Solution = require('./../models/solution/solution');
const User = require('./../models/user/user');
const Problem = require('./../../contest/models/problem/problem');

const router = express.Router();

var upload  = multer({dest:'solutions/'})
var originalname = 'solution';

const submitRules = [
    body('username').isString().trim().notEmpty(),
    body('contest').isString().trim().notEmpty(),
    body('problem').isString().trim().notEmpty(),
    body('language').isString().trim().notEmpty(),
];

router.post('/',upload.single(originalname),submitRules,handleValidation,async (req,res)=>{
    var solution;
     if(req.file){
      var count =await Solution.getObjCount(req.body.username,req.body.contest,req.body.problem)+1;
      solution = new Solution({ 
        problem:req.body.problem,
        contest:req.body.contest,
        username:req.body.username,
        id:req.body.contest+req.body.problem+req.body.username+count,
        language:req.body.language.toLowerCase(),
        description:Buffer.from(fs.readFileSync(req.file.path)).toString('base64'),
        submitted_on:new Date() 
      });
    }
       
    else if (!req.file) {
      count =await Solution.getObjCount(req.body.username,req.body.contest,req.body.problem)+1;
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
          var opt ={uri:`${config.judgeUrl}/${sol.id}`,
          agent:httpAgent,
          json:true
          };
          rp(opt).then((body)=>{
            if(body===true){
              User.findOne({'username':solution.username},(err,user)=>{
                if(err){
                  res.json({
                    "success":false,
                    "msg":err
                  })
                }else if(!user){
                  return res.json({
                    "success":false,
                    "msg":'Please Login before Submission'
                  })
                }else if(user){
                  var index = user.contest.findIndex(x => x.name===solution.contest);
                  if(index>=0){
                    var problemIndex = user.contest[index].problemSolved.findIndex(x=>x.name ===solution.problem);
                    if(problemIndex===-1){
                      user.contest[index].problemSolved.push({name:solution.problem,submissionTime:Date()});
                      user.contest[index].count++; 
                    }else{
                        if(!user.contest[index].problemSolved[problemIndex].submissionTime){
                          // console.log('name' in (user.contest[index].problemSolved[problemIndex]))
                          // console.log('33')
                          user.contest[index].problemSolved[problemIndex].submissionTime=Date();
                          user.contest[index].count++; 
                        }
                    }
                    
                  }else{
                    user.contest.push({name:solution.contest,problemSolved:[{name:solution.problem,submissionTime:Date()}],count:1});

                  }
                }
                user.save()
                    .then(()=>{

                      Problem.findOne({'code':solution.problem},(err,prob)=>{
                        if(prob.users.findIndex(user=>user===solution.username)===-1){
                            prob.users.push(solution.username);
                        }
                        prob.save()
                            .then(()=>{
                                res.json({
                                  "success":true,
                                  "msg":body
                                })
                              }).catch((e)=>{
                                res.json({
                                  "success":false,
                                  "msg":e
                                })
                              })
                            })
                      })

                  
                    })
              }else if(body==='CE'){
                res.json({
                  "success":true,
                  "msg":body
                })

              }else if(body==='TLE'){
                User.findOne({'username':solution.username},(err,user)=>{
                  if(err){
                    res.json({
                      "success":false,
                      "msg":err
                    })
                  }else if(user){
                    var index = user.contest.findIndex(x => x.name===solution.contest);
                    if(index>=0){
                      var problemIndex = user.contest[index].problemSolved.findIndex(x=>x.name ===solution.problem);
                      if(problemIndex===-1){
                        user.contest[index].problemSolved.push({
                          name:solution.problem, 
                          TLE:[{
                            count:1,
                            submissionTime:Date()
                         }]
                       });
                      
                      }else if(!user.contest[index].problemSolved[problemIndex].submissionTime){
                        console.log(user.contest[index].problemSolved[problemIndex].submissionTime)
                        var length = user.contest[index].problemSolved[problemIndex].TLE.length;
                        user.contest[index].problemSolved[problemIndex].TLE.push({
                          count:length+1,
                          submissionTime:Date()
                        })
                      }
                      
                    }else{
                      user.contest.push({
                        name:solution.contest,
                        problemSolved:[{
                          name:solution.problem,
                          TLE:[
                            {
                              count:1,
                              submissionTime:Date()
                            }
                          ]}
                        ]
                      });
  
                    }
                  }
                  user.save()
                  .then(()=>{
                    res.json({
                      "success":true,
                      "msg":body
                    })
              })
            })

            }else if(body==='RE'){
                User.findOne({'username':solution.username},(err,user)=>{
                  if(err){
                    res.json({
                      "success":false,
                      "msg":err
                    })
                  }else if(user){
                    var index = user.contest.findIndex(x => x.name===solution.contest);
                    if(index>=0){
                      var problemIndex = user.contest[index].problemSolved.findIndex(x=>x.name ===solution.problem);
                      if(problemIndex===-1){
                        user.contest[index].problemSolved.push({
                          name:solution.problem, 
                          RE:[{
                            count:1,
                            submissionTime:Date()
                         }]
                       });
                      
                      }else if(!user.contest[index].problemSolved[problemIndex].submissionTime){
                        console.log(user.contest[index].problemSolved[problemIndex].submissionTime)
                        var length = user.contest[index].problemSolved[problemIndex].RE.length;
                        user.contest[index].problemSolved[problemIndex].RE.push({
                          count:length+1,
                          submissionTime:Date()
                        })
                      }
                      
                    }else{
                      user.contest.push({
                        name:solution.contest,
                        problemSolved:[{
                          name:solution.problem,
                          RE:[
                            {
                              count:1,
                              submissionTime:Date()
                            }
                          ]}
                        ]
                      });
  
                    }
                  }
                  user.save()
                  .then(()=>{
                    res.json({
                      "success":true,
                      "msg":body
                    })
              })
            })

              }
              else if(!body){
                User.findOne({'username':solution.username},(err,user)=>{
                  if(err){
                    res.json({
                      "success":false,
                      "msg":err
                    })
                  }else if(user){
                    var index = user.contest.findIndex(x => x.name===solution.contest);
                    if(index>=0){
                      var problemIndex = user.contest[index].problemSolved.findIndex(x=>x.name ===solution.problem);
                      if(problemIndex===-1){
                        user.contest[index].problemSolved.push({
                          name:solution.problem, 
                          WA:[{
                            count:1,
                            submissionTime:Date()
                         }]
                       });
                      
                      }else if(!user.contest[index].problemSolved[problemIndex].submissionTime){
                        console.log(user.contest[index].problemSolved[problemIndex].submissionTime)
                        var length = user.contest[index].problemSolved[problemIndex].WA.length;
                        user.contest[index].problemSolved[problemIndex].WA.push({
                          count:length+1,
                          submissionTime:Date()
                        })
                      }
                      
                    }else{
                      user.contest.push({
                        name:solution.contest,
                        problemSolved:[{
                          name:solution.problem,
                          WA:[
                            {
                              count:1,
                              submissionTime:Date()
                            }
                          ]}
                        ]
                      });
  
                    }
                  }
                  user.save()
                  .then(()=>{
                    res.json({
                      "success":true,
                      "msg":body
                    })
              })
            })
          }else{
            res.json({
              "success":true,
              "msg":body
            })
          }
      }).catch((e)=>{
          res.json({
            "success":false,
            "msg":e
          })
      })
  })

})

// Submission history for a user, newest first, paginated.
// GET /solution/history/:username?page=1&limit=20
router.get('/history/:username', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = { username: req.params.username };
    const [total, submissions] = await Promise.all([
      Solution.countDocuments(filter),
      Solution.find(filter, { description: 0 })
        .sort({ submitted_on: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);
    res.json({ success: true, page, limit, total, submissions });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
