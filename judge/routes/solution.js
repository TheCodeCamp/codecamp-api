const express = require('express');
const judge = require('./../compileProblem');
const router = express.Router();

router.get('/',(req,res)=>{
    var body = JSON.parse(req.body)
    console.log(body)
    var description=body.description;
    var language= body.language;
    judge.compileAndRunProblem(language,description).then((result)=>{
        console.log(result)            
        res.send(result);
      }).catch((e)=>{
        //res.status(200).send(e);
        console.log(e)
        if(e.toString().indexOf("Error: Command failed:")!=-1){
          res.send(e)
        }else{
          res.send(e)
        }

    })
})

router.get('/a',(req,res)=>{
    res.send('I am working');
})

module.exports=router;
