const express = require('express');
const judge = require('./../compileProblem');
//const db = require('./../utils/database/mongodb');
const Solution= require('./../models/solution/solution');
const Problem = require('./../../contest/models/problem/problem');
const mongoose = require('mongoose')
const router = express.Router();

router.get('/:id',(req,res)=>{
     Solution.findOne({'id':req.params.id},function(err,solution){
       if(err){
          res.send(err)
       }else if(!solution){
          res.send('null')
       }else if(solution){
        const sol2 = Object.assign({}, solution);
        const contest = sol2._doc.contest;
        const problem = sol2._doc.problem;
        const description=sol2._doc.description;
        const id = sol2._doc.id;
        const language= sol2._doc.language;

        Problem.findOne({'code':problem},function(err,pro){
          if(err){
            res.send(err)
         }else if(!pro){
            res.send('null')
         }else if(pro){
            const option = {
              timeout:pro.timelimit,
              maxBuffer:pro.sourcelimit,
              encoding:'utf8'
            }
        judge.compileAndRunProblem(contest,problem,id,language ,description,option).then((result)=>{      
          console.log(result); 
          res.send(result);
        }).catch((e)=>{
          var compileError = /(g[/++/]|gcc|javac)/;
          if(e.cmd.toString().match(compileError)){
            res.status(200).send('CE' + e);
          }else if(e.killed){
            res.status(200).send('TLE');
          }else{
            res.status(200).send('RE');
          }
      })

        }});
    }

 })


  
})


module.exports=router;
