const express = require('express');
const IR= require('../ide');
const router = express.Router();

router.post('/',(req,res)=>{

    const body = req.body;
    // console.log(body);
    const option = {
        language:body.language,
        description:body.description,
        input:body.input
    };
    IR.IdeSolution(option)
        .then((result)=>{
           // console.log(result)
        //    let size = sizeOf((result.res.toString()).le
            let obj = {
                output:result.res,
                time:result.time,
                msg:'Successfully Executed',
            }
            obj = JSON.stringify(obj);
            res.send(obj);
        })
        .catch((err)=>{
            console.log(err)
            var compileError = /(g[/++/]|gcc|javac|CE)/;
            if(err.toString().match(compileError)){
                let error = err.toString();
                error = error.substring(error.indexOf("\n") + 1);
                let obj = {
                    output:error,
                    time:"0",
                    msg:'Compilation Error',
                }
                res.send(obj);
            }else if(err.timelimit*1000>=option.timeout){
                let obj = {
                    output:'',
                    time:option.timeout,
                    msg:'Time Limit Exceed',
                }
                res.status(200).send(obj);
            }else{
                let error = (err.error).toString();
                let obj = {
                    output:error,
                    time:err.timelimit,
                    msg:'Run Time Error',
                }
                error = error.substring(error.indexOf("\n") + 1);
                res.send(obj);
            }
        })

})

module.exports = router;