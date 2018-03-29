const util = require('util');
const exec = require('child_process').exec  ;
const path = require('path');
const fs = require('fs')
const buffer = require('buffer')


const containSysCall = async ()=>{
    return new Promise((resolve,reject)=>{
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
              reject({result:false,msg:'Try to remove System Calls from your program and try again!'});
            }
            resolve(true);
        })
    })
}

module.exports ={containSysCall};