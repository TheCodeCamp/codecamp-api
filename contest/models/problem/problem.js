const mongoose = require('mongoose');  
const Contest = require('./../contest/contest') 
const User = require('./../../../server/models/user/user')

const ProblemSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true
   },
    name:{
        type:String
    },
    level:{
        type:String
    },
    description:{
        type:String,
        default:""
    },
    successfulSubmission:{
        type:Number,
        default:0
    },
    input_format:{
        type:String
    },
    output_format:{
        type:String
    },
    constraints:{
        type:String
    },
    input_example:{
        type:String
    },
    output_example:{
        type:String
    },
    explanation_example:{
        type:String,
        default:""
    },
    date_added:{
        type:Date
    },
    timelimit:{
        type:Number
    },
    sourcelimit:{
        type:Number
    },
    score:{
        type:Number
    },
    users:[{
        type:mongoose.Schema.Types.String,
        refs:'User'
    }],
    author:{
        type:String
    },
    testCaseInput:{
        type:String,
        default:""
    },
    testCaseOutput:{
        type:String,
    },
    contest:{
        type:mongoose.Schema.Types.String,
        refs:'Contest'
    }
} )

module.exports=mongoose.model('Problem',ProblemSchema)