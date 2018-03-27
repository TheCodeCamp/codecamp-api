const util = require('util');
const exec = require('child_process').exec  ;
const path = require('path');
const fs = require('fs')
const buffer = require('buffer')


//Compile program and check for error if okay the run it

const compileProblem= async (lang , filename,checkFile)=>{
    var cmd,file;
    switch(lang){
        case "c":
            file = path.basename(filename,'.c') +".out ";
            cmd="cd "+"\"" + path.join(__dirname,"result/source") +"\"" + " && gcc -o \"" +path.join(__dirname,"result/binary/") + "\""+file  +" "+ filename+" -lm";
            break
        case "c++":
        case "cpp":
            file = path.basename(filename,'.cpp')+".out";
            cmd="cd "+"\""+ path.join(__dirname,"result/source") +"\""+ " && g++ -o \"" + path.join(__dirname,"result/binary/")+ "\""+file + " " +filename;
            break;
        case "java":
            file = path.basename(filename,'.java')
            cmd ="cd "+"\""+ path.join(__dirname,"result/source") + "\" && javac -d \"" + path.join(__dirname,"result/binary/") +"\" " +filename;
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
            cmd= "cd "+ "\""+ path.join(__dirname,"result/binary") + "\" && ./" + file +  " <\""+ path.join(__dirname,"result/input/")+contest+"/"+problem+".txt\"";
            break;
        case "c++":
        case "cpp": 
            cmd = "cd "+"\""+ path.join(__dirname,"result/binary") + "\" && ./" + file +" <\""+ path.join(__dirname,"result/input/")+contest+"/"+problem+".txt\"";
            break;
        case "java":
            cmd =  "cd "+"\""+ path.join(__dirname,"result/binary") + "\" && java " + file +" <\""+ path.join(__dirname,"result/input/")+contest+"/"+problem+".txt\"";
            break;
        case "python":
            cmd = "cd "+"\""+ path.join(__dirname,"result/source") + "\" && python " + file +" <\""+ path.join(__dirname,"result/input/")+contest+"/"+problem+".txt\"";
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
    return new Promise((resolve,reject)=>{
        if(UserResult===serverResult){
            resolve(true)
        }else{
            resolve(false)
        }
    })
}
const serverResult = async (contest,problem)=>{
    return new Promise((resolve,reject)=>{
       var buf= fs.readFileSync(path.join(__dirname,"result/output/"+contest+"/"+problem+".txt"),'utf8');
       resolve(buf)
    }).catch((e)=>{
        console.log(e)
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
        filename+='.py';
    }else{
        filename+=lang;
    }
    return new Promise((resolve,reject)=>{
        fs.writeFile(path.join(__dirname ,'result/source/'+filename),fileout, function(err) {
            if(err) {
                console.log(path.join(__dirname ,'result/source/'+filename));
                reject('Can not write file');
            }
            resolve(filename);
        });
    })
}

async function compileAndRunProblem(contest,problem,id,lang ,description,option){
    console.log(contest)
    const filename= await base64tofile(description,lang,0);
    if(lang!=='python'){
        const file = await compileProblem(lang,filename,0);
    }
    const t0 = process.hrtime();
    const result= await runCompiled(lang,file,contest,problem,option,t0);
    const serverRes= await serverResult(contest,problem);
    const Result = await checkResult(result,serverRes);
    //console.log(Result);
    return Result;
  
}
module.exports = {compileAndRunProblem,compileProblem,runCompiled,base64tofile,serverResult,checkResult}