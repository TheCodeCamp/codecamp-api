const express = require('express');
const http = require('http');
const querystring = require('querystring');

const router = express.Router();

router.post('/',(req,res)=>{
    
    let data = {
      language:req.body.language,
      description:req.body.description,
      input:req.body.input
    }

    const dataString = querystring.stringify(data);
      
      const options = {
        port: 3001,
        path: '/ide',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(dataString)
        }
      };
      
      const reqtojudge = http.request(options, (resfromjudge) => {
        resfromjudge.setEncoding('utf8');
        resfromjudge.on('data', (chunk) => {
          res.json({
            msg:'Yahoo!',
            output:chunk
          })
        });
      });
      
      reqtojudge.on('error', (e) => {
        res.send(e);
      });
      
      // write data to request body
      reqtojudge.write(dataString);
      // reqtojudge.end();

})

module.exports = router;