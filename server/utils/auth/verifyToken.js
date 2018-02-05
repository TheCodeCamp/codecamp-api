var jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'Login Required ' });
  jwt.verify(token,'secret', function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate.' }); 
    req.username = decoded.username;
    next();
  });
}
module.exports = verifyToken;