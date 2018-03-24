const express = require('express');
const IR= require('../ide');
const router = express.Router();

router.post('/',(req,res)=>{

    const body = req.body;
    console.log(body);
    const option = {
        language:body.language,
        description:body.description,
        input:body.input
    };
    IR.IdeSolution(option)
        .then((result)=>{
            console.log(result)
            res.send(result);
        })
        .catch((err)=>{
            var compileError = /(g[/++/]|gcc|javac)/;
            if(err.toString().match(compileError)){
                let error = err.toString();
                error = error.substring(error.indexOf("\n") + 1);
                res.send(error);
            }else if(err.timelimit*1000>=option.timeout){
                res.status(200).send('Time Limit Exceed');
            }else{
                let error = (err.error).toString();
                error = error.substring(error.indexOf("\n") + 1);
                res.send(error);
            }
        })

})

module.exports = router;