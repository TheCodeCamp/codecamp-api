<<<<<<< HEAD
=======
<<<<<<< HEAD
const mongoose = require('mongoose')     
const SolutionJson = require('./solution.json')

const SolutionSchema = new mongoose.Schema(SolutionJson);
//const Solution = mongoose.model('Solution',SolutionSchema)
SolutionSchema.statics.getObjcount =async function(username,code){
    var User = this;
    return new Promise((resolve,reject)=>{
        User.count({$and:[{username:username},{code:code}]},(err,count)=>{
            if(err){
                reject('can not get user')
            }
            console.log(count)
            resolve(count+1)
        })
    })
}

module.exports= mongoose.model('Solution',SolutionSchema)
=======
>>>>>>> 73a9b1d0a1fabb223c70b50431b009c32cb343a5
const mongoose = require('mongoose')     
const SolutionJson = require('./solution.json')

const SolutionSchema = new mongoose.Schema(SolutionJson);
module.exports= mongoose.model('Solution',SolutionSchema)
<<<<<<< HEAD
=======
>>>>>>> aae61357893efc5840f7327a2cce64f575d50d4d
>>>>>>> 73a9b1d0a1fabb223c70b50431b009c32cb343a5
