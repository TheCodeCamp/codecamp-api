const express = require('express');
const _ = require('lodash');
const rp = require('request-promise')
const http = require('http')
const fs = require('fs')
const app= require('./../../server/app')
const mongoose = require('mongoose')
const request = require('request')
const multer = require('multer')
// const encode = require('./../utils/encoding');
//const db = require('./../utils/db/db');
const Solution = require('./../models/solution/solution');
const User = require('./../models/user/user');
const Problem = require('./../../contest/models/problem/problem');
const Ranking = require('./../../contest/models/ranking/ranking');

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
            if(body===true){
              User.findOne({'username':solution.username},(err,user)=>{
                if(err){
                  res.json({
                    "success":false,
                    "msg":e
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
                      "msg":e
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
                      "msg":e
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
                      "msg":e
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
module.exports = router;
