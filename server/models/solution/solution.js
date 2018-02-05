const mongoose = require('mongoose')     
const SolutionJson = require('./solution.json')

const SolutionSchema = new mongoose.Schema(SolutionJson);


SolutionSchema.statics.getObjCount =function (username,code){
    var Solution = this;
    return Solution.count({$and:[{'username':username},{'code':code}]});
}

module.exports= mongoose.model('Solution',SolutionSchema);