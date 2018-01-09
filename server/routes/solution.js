const express = require('express');
const _ = require('lodash');
const http = require('http')
const fs = require('fs')
const mongoose = require('mongoose')
const multer = require('multer')
const encode = require('./../utils/encoding');
const db = require('./../utils/db/db');
//const cr = require('./../../judge/compileProblem')
const Solution = require('./../models/solution/solution');
const router = express.Router();





/*var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads')
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})
*/
var upload  = multer({dest:'solutions/'})
var originalname = 'solution'

router.post('/',upload.single(originalname),(req,res)=>{
  //console,log(req.file)
    if (req.file) {
      var solution = new Solution({ 
          id:req.body.id,
          username:req.body.username,
         // filename: req.file.originalname,
          language:req.body.language.toLowerCase(),
          description:new Buffer(fs.readFileSync(req.file.path)).toString('base64'),
          submitted_on:new Date()
        });
        solution.save().then((sol) => {
         /* cr.compileAndRunProblem(sol.language,sol.description).then((okay)=>{
            console.log(okay)            
            res.send(okay);
          }).catch((e)=>{
            //res.status(200).send(e);
            console.log(e)
            if(e.toString().indexOf("Error: Command failed:")!=-1){
              res.send(e)
            }else{
              res.send(e)
            }

          })*/
          console.log(JSON.stringify(sol))

          const options = {
            hostname: 'localhost:3002',
            path: '/a',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(JSON.stringify(sol))
            }
          };

          const reqes = http.request(options, (response) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
              console.log(`BODY: ${chunk}`);
            });
            response.on('end', () => {
              console.log('No more data in response.');
            });
          });
          
          reqes.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
          });
          
          // write data to request body
          reqes.write(JSON.stringify(sol));
          reqes.end();


        }, (e) => {
          res.status(400).send(e)
        })
      } else {
        res.status(500).json({ error: `No file was provided in the 'data' field` });
      }
})

module.exports = router;