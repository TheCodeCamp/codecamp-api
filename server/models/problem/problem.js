const mongoose = require('mongoose')   
const ProblemJson = require('./problem.json')

const ProblemSchema = new mongoose.Schema(ProblemJson)

module.exports=mongoose.model('Problem',ProblemSchema)