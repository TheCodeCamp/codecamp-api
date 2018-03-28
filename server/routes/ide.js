const express = require('express');
const http = require('http');
const querystring = require('querystring');

const router = express.Router();

router.post('/',(req,res)=>{
  console.log(req.body)
    
    let data = {
      language:(req.body.language).toLowerCase(),
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
        let body = '';     
        resfromjudge.on('data', (chunk) => {
          body+=chunk;
        });
        resfromjudge.on('end', () => {
          res.send(JSON.parse(body));
        });
        
      });

      reqtojudge.on('error',(e)=>{
        console.error(`problem with request: ${e.message}`);
      })
      
      // write data to request body
      reqtojudge.write(dataString);
      reqtojudge.end();

})

module.exports = router;