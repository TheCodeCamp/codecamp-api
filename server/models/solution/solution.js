const mongoose = require('mongoose')  
const Schema = mongoose.Schema;   
// const SolutionJson = require('./solution.json')

const SolutionSchema = new mongoose.Schema({
    id:{
        type:String
    },
    username:{
        type: Schema.Types.String, ref: 'User'
    },
    submitted_on:{
        type:Date
    },
    language:{
        type:String
    },
    result:{
        type:String
    },
    score:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default:""
    },
    description:{
        type:String
    },
    contest:{
        type: Schema.Types.String, ref: 'Contest'
    },
    problem:{
        type: Schema.Types.String, ref: 'Problem'
    }
});


SolutionSchema.statics.getObjCount =function (username,contest,problem){
    var Solution = this;
    return Solution.count({$and:[{'username':username},{'problem':problem},{'contest':contest}]});
}

module.exports= mongoose.model('Solution',SolutionSchema);