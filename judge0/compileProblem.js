const util = require('util');
const exec = require('child_process').exec  ;
const path = require('path');
const fs = require('fs')
const buffer = require('buffer')

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

//Compile program and check for error if okay the run it

const compileProblem= async (lang , filename)=>{
    var cmd,file;
    switch(lang){
        case "c":
            file = path.basename(filename ,path.extname(filename)) +".out "
            cmd="cd result && gcc -o " + file + " " + path.join(__dirname,"result/"+filename);
            break;
        case "c++":
        case "cpp":
            file = path.basename(filename ,path.extname(filename)) +".out "
            cmd = "cd result && g++ -o " + file + " " + path.join(__dirname,"result/"+filename);
            break;
        case "java":
            file = path.basename(filename ,path.extname(filename)) 
            cmd = "cd result && javac "+ path.join(__dirname,"result/"+filename)
    }

        
    return new Promise((resolve,reject)=>{
     exec(cmd, (error, stdout, stderr) => {
        if (error) {
          //console.error(`${error}`);

          reject(error);
        }
        console.log( cmd)
        resolve(file)
      }); 
    })  
}

//Run Compiled if okay the check result

async function runCompiled(lang,file){

    var cmd;
    switch(lang){
        case "c":
            cmd="cd result && ./" + file +  " <'input.txt'";
            break;
        case "c++":
        case "cpp":
            cmd = "cd result && ./" + file +" <'input.txt'";
            break;
        case "java":
            cmd = "cd result && java " + file +" <'input.txt'";
    }
    
    return new Promise((resolve,reject)=>{
    exec(cmd, {timeout:100000,maxBuffer:2147483647,encoding:'utf8'},(error, stdout, stderr) => { 
        if (error) {             
              reject(error);
        }
        var res=stdout;
       console.log(res)
        resolve(res);
      });
    })
}

//Check Result of run program

const checkResult=async (UserResult,serverResult)=>{
   // UserResult = fs.readFileSync(UserResult,'utf16le')
    return new Promise((resolve,reject)=>{
        if(UserResult===serverResult){
            resolve('Correct answer')
        }else{
            resolve('wrong answer')
        }
    })
}
const serverResult = async ()=>{
    return new Promise((resolve,reject)=>{
       var buf= fs.readFileSync(path.join(__dirname,'result/result.txt'),'utf8');
       resolve(buf)
    }).catch((e)=>{
        console.log(e)
    })
}

const base64tofile = async (base64,lang)=>{
    var fileout=new Buffer(base64,'base64').toString('ascii');
    var filename = "Solution.";
    if(lang=='C++'|| lang == 'c++'){
        filename+='cpp';
    }else{
        filename+=lang;
    }
    return new Promise((resolve,reject)=>{
        fs.writeFile(path.join(__dirname ,'result/'+filename),fileout, function(err) {
            if(err) {
                reject('Can not write file');
            }
            resolve(filename);
        });
    })
}

async function compileAndRunProblem(lang , description){
    const filename= await base64tofile(description,lang);
    const file = await compileProblem(lang,filename);
    const result= await runCompiled(lang,file);
    const serverRes= await serverResult();
    console.log(serverRes)
    const Result = await checkResult(result,serverRes);
    //console.log(Result)
    return Result;
  
}
//base64tofile('dmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7DQp2YXIgZnMgPSByZXF1aXJlKCdmcycpOw==','C');
//compileAndRunProblem('C','I2luY2x1ZGU8c3RkaW8uaD4NCmludCBtYWluKCl7DQoJcHJpbnRmKCJoZWxsbyB3b3JsZCIpOw0KfQ0K')

/*compileProblem('C','test.c')
    .then((file)=>{
        runCompiled('C',file)})
        .then((res)=>{
            checkResult(res,'abcd')
        })
*/

module.exports = {compileAndRunProblem,compileProblem,runCompiled,base64tofile,serverResult,checkResult}