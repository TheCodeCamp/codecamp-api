const util = require('util');
const exec = require('child_process').exec  ;
const path = require('path');
const fs = require('fs')
const buffer = require('buffer')
const isSysCall = require('./utils/authentication/systemcall');


//Compile program and check for error if okay the run it

const compileProblem= async (lang , filename,checkFile)=>{
    var cmd,file;
    switch(lang){
        case "c":
        case "C":
            file = path.basename(filename,'.c') +".out ";
            cmd="cd "+"\"" + path.join(__dirname,"/result/source") +"\"" + " && gcc -o /home/shiva/runer/" +file  +" "+ filename+" -lm";
            break
        case "c++":
        case "cpp":
        case "C++":
        case "CPP":
        case "Cpp":
            file = path.basename(filename,'.cpp')+".out";
            cmd="cd "+"\""+ path.join(__dirname,"/result/source") +"\""+ " && g++ -o /home/shiva/runer/"  + file + " " +filename;
            break;
        case "java":
        case "JAVA":
        case "Java":
            file = path.basename(filename,'.java')
            cmd ="cd "+"\""+ path.join(__dirname,"/result/source") + "\" && javac -d /home/shiva/runer/" +  " " +filename;
    }        
    return new Promise((resolve,reject)=>{
     exec(cmd, (error, stdout, stderr) => {
        if (error) {
         // console.error(`${error}`);
          reject(error);
        }
        if(checkFile){
            if(file.match(/Main/)){
                resolve(file);
            }else{
                reject("CE \n Class name must be Public Main");
            }

        }else{
            if(file.match(/Solution/)){
                resolve(file);
            }else{
                reject("CE \n Class name must be Public Solution");
            }
        }
        resolve(file)
      }); 
    })  
}

//Run Compiled if okay the check result

async function runCompiled(lang,file,contest,problem,option,t0){

    var cmd;
    switch(lang){
        case "c":
            cmd= "cd /home/shiva/runer"+ "&& ./" + file +  " <"+ path.join(__dirname,"/result/input/")+contest+"/"+problem+".txt";
            break;
        case "c++":
        case "cpp": 
            cmd = "\"cd /home/shiva/runer\""+"** ./" + file +" <"+ path.join(__dirname,"/result/input/")+contest+"/"+problem+".txt";
            break;
        case "java":
            cmd =  "cd /home/shiva/runer" +  " && java " + file +" <"+ path.join(__dirname,"/result/input/")+contest+"/"+problem+".txt";
            break;
        case "python":
            cmd = "cd /home/shiva/runer" + " && python " + file +" <"+ path.join(__dirname,"/result/input/")+contest+"/"+problem+".txt";
            break;
    }
    
    return new Promise((resolve,reject)=>{
    exec(cmd,option,(error, stdout, stderr) => { 
        if (error) {      
            //console.log(error) 
            let timelimit =0; 
            const t1 = process.hrtime();
            timelimit = (t1[0]-t0[0]);
            console.log(timelimit);
            reject({error,timelimit});
        }
        var res=stdout;
        resolve(res);
      });
    })
}

//Check Result of run program

const checkResult=async (UserResult,serverResult)=>{
   // UserResult = fs.readFileSync(UserResult,'utf16le')
//    console.log(UserResult)
//    console.log(serverResult)
    return new Promise((resolve,reject)=>{
        // if(UserResult==serverResult){
        //     resolve('Accepted')
        // }else{
        //     resolve('WA')
        // }
        fs.writeFileSync(path.join(__dirname,'/result/user/serverResult.txt'),serverResult,{encoding:'utf8'});
        fs.writeFileSync(path.join(__dirname,'/result/user/userResult.txt'),UserResult,{encoding:'utf8'});
         
        exec("diff -Z "+path.join(__dirname,'/result/user/userResult.txt') + " " + path.join(__dirname,'/result/user/serverResult.txt'),(error, stdout, stderr) => { 
            if (error) {      
                // console.log(error) 
                resolve('WA');
            }
            
                resolve('Accepted')
            
          });
        
    })
}
const serverResult = async (contest,problem)=>{
    return new Promise((resolve,reject)=>{
       var buf= fs.readFileSync(path.join(__dirname,"/result/output/"+contest+"/"+problem+".txt"));
       resolve(buf)
    }).catch((e)=>{
        console.log(e)
    })
}

const isPython = async (file)=>{
    cmd = "cp " + path.join(__dirname + '/result/source/') + file + " /home/shiva/runer/Main.py"
    console.log(cmd)
    return new Promise((resolve,reject)=>{
        exec(cmd,(error, stdout, stderr) => { 
            if (error) {    
                console.log(error)  
                reject();
            }
            resolve(file);
          });
    }).catch((e)=>{
        console.log(e);
    })
}

const base64tofile = async (base64,lang,ide)=>{
    const fileout=new Buffer(base64,'base64').toString('ascii');
    let filename;
    if(ide){
        filename = 'Main.';
    }else{
        filename = 'Solution.';
    }
    if(lang=='C++'|| lang == 'c++'){
        filename+='cpp';
    }else if(lang==='python'){
        filename+='py';
    }else{
        filename+=lang;
    }
    return new Promise((resolve,reject)=>{
        fs.writeFile(path.join(__dirname ,'result/source/'+filename),fileout, function(err) {
            if(err) {
                console.log(err);
                reject('Can not write file');
            }
            resolve(filename);
        });
    })
}

async function compileAndRunProblem(contest,problem,id,lang ,description,option){
     console.log(lang)
    const filename= await base64tofile(description,lang,0);
    // const isSecure = await isSysCall.containSysCall(filename);
    // console.log('isSecure')
    let file;
    if(lang!=='python'){
        file = await compileProblem(lang,filename,0);
    }else if(lang==='python'){
        file = await isPython(filename);
    }
    const t0 = process.hrtime();
    const result= await runCompiled(lang,file,contest,problem,option,t0);
    // console.log(result)
    const serverRes= await serverResult(contest,problem);
    // console.log(serverRes)
    const Result = await checkResult(result,serverRes);
    console.log(Result);
    return Result;
  
}
module.exports = {compileAndRunProblem,compileProblem,runCompiled,base64tofile,serverResult,checkResult,isPython}
