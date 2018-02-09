const mongoose = require('mongoose')     
const SolutionJson = require('./solution.json')

const SolutionSchema = new mongoose.Schema(SolutionJson);
module.exports= mongoose.model('Solution',SolutionSchema)
