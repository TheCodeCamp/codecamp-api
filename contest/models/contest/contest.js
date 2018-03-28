const mongoose = require('mongoose');
const Problem = require('./../problem/problem')

let contestSchema = new mongoose.Schema({
    'name':{
        type:String,
        required:true,
    },
    'id':{
        type:String,
        required:true,
        unique:true
    },
    'startTime':{
        type:Date,
        required:true
    },
    'endTime':{
        type:Date,
        required:true
    },
    'description':{
        type:String
    },
    'questions':[{
        type: mongoose.Schema.Types.String,
        ref:'Problem'
    }]
});


contestSchema.statics.getEndTime = async function(contest){
    var Contest = this;
    Contest.findOne({'id':contest},(err,con)=>{
        if(err){
            return Date();
        }
        return con.endTime;
    })
    
}


module.exports = mongoose.model('Contest',contestSchema)