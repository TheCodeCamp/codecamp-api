const mongoose = require('mongoose')  
const Schema = mongoose.Schema;   

const SolutionSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,

    },
    problemCode:{
        type: Schema.Types.ObjectId, ref: 'Problem' 
    },
    username:{
        type:Schema.Types.ObjectId,ref:'User',
        required:true
    },
    submitted_on:{
        type:Date,
        default:Date()
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
        type:String,
        default:""
    }
});
module.exports= mongoose.model('Solution',SolutionSchema)
