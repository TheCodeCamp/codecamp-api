const express = require('express');
const http = require('http');
const querystring = require('querystring');

const router = express.Router();

router.post('/',(req,res)=>{
    
    const postData ={
        'Hello':'World'
    }

    const ss = querystring.stringify(postData);
      
      const options = {
        port: 80,
        path: '/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(ss)
        }
      };
      
      const reqtojudge = http.request(options, (resfromjudge) => {
        resfromjudge.setEncoding('utf8');
        resfromjudge.on('data', (chunk) => {
          res.send(chunk);
        });
      });
      
      reqtojudge.on('error', (e) => {
        res.send('google');
      });
      
      // write data to request body
      reqtojudge.write(ss);
      reqtojudge.end();

})

module.exports = router;