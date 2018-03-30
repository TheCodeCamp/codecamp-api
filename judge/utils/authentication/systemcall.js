const util = require('util');
const exec = require('child_process').exec  ;
const path = require('path');
const fs = require('fs')
const buffer = require('buffer')


const containSysCall = async (file)=>{
    let cmd = "grep -f " + path.join(__dirname +'/syscalls_f.txt')+ " "+path.join(__dirname + './../../result/source/')+file;
    return new Promise((resolve,reject)=>{
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(error)
              reject({result:'SC',msg:'Try to remove System Calls from your program and try again!'});
            }
            resolve({result:true});
        })
    })
}

module.exports ={containSysCall};