const fs = require('fs');
const path = require('path');

// function to encode file data to base64 encoded string
module.exports.base64_encode=(file)=> {
    var bitmap = fs.readFileSync(path.join(__dirname,file));
    return new Buffer(bitmap).toString('base64');
}

