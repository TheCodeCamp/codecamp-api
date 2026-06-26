const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./../../../server/models/user/user');
const Problem = require('./../problem/problem');
const Contest = require('./../contest/contest');

const RankingSchema = new Schema({
    username:{
        type:Schema.Types.String,
        ref:'User'
    },
    score:{
        type:Number,
        default:0
    },
    submissionTime:{
        type:Date
    },
    WA:{
        type:Number,
        default:0
    },
    problemSolved:[{
        type:Schema.Types.String,
        ref:'Problem'
    }],
    contest:{
        type:Schema.Types.String,
        ref:'Contest'
    }

})

module.exports = mongoose.model('Ranking',RankingSchema);