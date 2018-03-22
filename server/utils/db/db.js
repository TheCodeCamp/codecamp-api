const mongoose = require('mongoose')
const gridFsStream = require('gridfs-stream');

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/OnlineJudge')



module.exports = {
  mongoose
}