
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec  ;
const cp = require('./compileProblem');

async function runCompiled(lang,file,input,t0){

    var cmd;
    
    fs.writeFileSync(path.join(__dirname,"result/binary/ideInput.txt"),input);
    switch(lang){
        case "c":
            cmd= "cd "+ "\""+ path.join(__dirname,"result/binary") + "\" && ./" + file +  " < ideInput.txt";
            break;
        case "c++":
        case "cpp": 
            cmd = "cd "+"\""+ path.join(__dirname,"result/binary") + "\" && ./" + file +" < ideInput.txt";
            break;
        case "java":
            cmd =  "cd "+"\""+ path.join(__dirname,"result/binary") + "\" && java " + file +" < ideInput.txt"; 
    }
   
    
    return new Promise((resolve,reject)=>{
    exec(cmd,{timeout:8000,maxBuffer:5000000},(error, stdout, stderr) => { 
        if (error) {      
            //console.log(error) 
           
            let timelimit =0; 
            const t1 = process.hrtime();
            timelimit = (t1[0]-t0[0]);
            reject({error,timelimit});
        }
        var res=stdout;
        resolve(res);
      });
    })
}

async function IdeSolution(option) {

    const filename = await cp.base64tofile(option.description,option.language,1);
    const file = await cp.compileProblem(option.language,filename);
    const t0 = process.hrtime();
    const result = await runCompiled(option.language,file,option.input,t0);
    console.log('dhfhf')
    return result; 
}

module.exports = {IdeSolution};