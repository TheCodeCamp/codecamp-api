
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
            break;
        case "python":
            cmd =  "cd "+"\""+ path.join(__dirname,"result/source") + "\" && python " + file +" < ideInput.txt";  
            break;
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
        let res=stdout;
        const t = process.hrtime();
        console.log(t)
        let time = (t[0]-t0[0]+(t[1]-t0[1])/1000000000);
        time = parseFloat(time).toFixed(2)      
        resolve({res,time});
      });
    })
}

async function IdeSolution(option) {
    const filename = await cp.base64tofile(option.description,option.language,1);
    let file ;
    console.log(filename)
    
    if(option.language!=='python'){
        file = await cp.compileProblem(option.language,filename,1);
    }else if(option.language==='python'){
        file = await cp.isPython(filename);
    }
 
    const t0 = process.hrtime();
    const result = await runCompiled(option.language,file,option.input,t0);
    console.log(result)
    return result; 
}

module.exports = {IdeSolution};