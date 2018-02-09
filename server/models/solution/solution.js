const mongoose = require('mongoose')     
const SolutionJson = require('./solution.json')

const SolutionSchema = new mongoose.Schema(SolutionJson);


SolutionSchema.statics.getObjCount =function (username,contest,problem){
    var Solution = this;
    return Solution.count({$and:[{'username':username},{'problem':problem},{'contest':contest}]});
}

module.exports= mongoose.model('Solution',SolutionSchema);