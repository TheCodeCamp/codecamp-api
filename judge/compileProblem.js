const { exec } = require('child_process');
const path = require('path');
const fs = require('fs')

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

//Compile program and check for error if okay the run it

var compileAndRunProblem = (lang , filename ,runCompiled,checkResult)=>{
    var cmd,file;
    switch(lang){
        case "C":
            file = path.basename(filename ,path.extname(filename)) +".out "
            cmd="gcc -o " + file 
            break;
        case "C++":
            file = path.basename(filename ,path.extname(filename)) +".out "
            cmd = "g++ -o " + file;
            break;
        case "JAVA":
            file = path.basename(filename ,path.extname(filename)) 
            cmd = "javac "
    }
     exec(cmd + path.join(__dirname,filename), (error, stdout, stderr) => {
        if (error) {
          console.error(`${error}`);
          return;
        }
        return runCompiled(lang,file,checkResult)
      });
      
  
}

//Run Compiled if okay the check result

function runCompiled(lang,file,checkResult){

    var cmd;
    switch(lang){
        case "C":
            cmd="./" + file ;
            break;
        case "C++":
            cmd = "./" + file;
            break;
        case "JAVA":
            cmd = "java " + file;
    }

    exec(cmd, {timeout:1000,maxBuffer:1020000000},(error, stdout, stderr) => {
        if (error) {
          if(error.toString().search(/Command failed: test.out/)>0){
            console.error('TLE')
          }else{
              console.error("RE")
          }
          return;
        }
        
        return checkResult(stdout,fs.readFileSync(path.join(__dirname ,'result.txt')).toString());
      });
}

//Check Result of run program

var checkResult=(UserResult,serverResult)=>{
    if(UserResult===serverResult){
        console.log('Correct answer')
    }else{
        console.log('wrong answer')
    }
}

compileAndRunProblem('JAVA','Hello.java',runCompiled,checkResult)
