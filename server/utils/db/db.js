const mongoose = require('mongoose')

mongoose.Promise = global.Promise
<<<<<<< HEAD
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/OnlineJudge')
=======
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/OnlineJudge',{'useMongoClient':true})
>>>>>>> 08e47d897437c805e78a5f0730556facf6bb31a6
module.exports = {
  mongoose
}