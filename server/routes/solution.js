const express = require('express');
const _ = require('lodash');
const fs = require('fs')
const mongoose = require('mongoose')
const multer = require('multer')
const encode = require('./../utils/encoding');
const db = require('./../utils/db/db');
const cr = require('./../../judge/compileProblem')
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
          language:req.body.language,
          description:new Buffer(fs.readFileSync(req.file.path)).toString("base64"),
          submitted_on:new Date()
        });
        solution.save().then((sol) => {
          res.send(cr.compileAndRunProblem(sol.language,sol.description,cr.runCompiled,cr.checkResult));
        }, (e) => {
          res.status(400).send(e)
        })
      } else {
        res.status(500).json({ error: `No file was provided in the 'data' field` });
      }
})

module.exports = router;