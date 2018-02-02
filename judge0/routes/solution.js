const express = require('express');
const judge = require('./../compileProblem');
const db = require('./../utils/database/mongodb');
const Solution= require('./../models/solution/solution');
const mongoose = require('mongoose')
const router = express.Router();

router.get('/:id',(req,res)=>{
     Solution.findOne({'id':req.params.id},function(err,solution){
       if(err){
          res.send(err)
       }else if(!solution){
          res.send('null')
       }else if(solution){
      var description=solution.description;
      var language= solution.language;
      judge.compileAndRunProblem(language,description).then((result)=>{        
          res.send(result + '***' + req.params.id);
        }).catch((e)=>{
         /* var compileError = /(g[/++/]|gcc|javac)/;
          if(e.cmd.toString().match(compileError)){
            res.status(200).send('ce');
          }//else{
            res.status(200).send('TLE');
        
          console.log(e.cmd)
          if(e.toString().indexOf("Error: Command failed:")!=-1){
            res.send(e)
          }else{
            res.send(e.cmd)
          }
          */
          var compileError = /(g[/++/]|gcc|javac)/;
          if(e.cmd.toString().match(compileError)){
            res.status(200).send('ce'+ '***' + req.params.id);
          }else if(e.killed){
            res.status(200).send('TLE'+ '***' + req.params.id);
          }else{
            res.status(200).send('RE'+ '***' + req.params.id);
          }
      })
    }
 })
  
})

module.exports=router;
