const mongoose = require('mongoose');
const Problem = require('./../problem/problem')

var contestSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref:'Problem'
    }]
})

module.exports = mongoose.model('Contest',contestSchema)