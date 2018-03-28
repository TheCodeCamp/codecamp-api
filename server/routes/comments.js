const express = require('express');
const Problem = require('./../../contest/models/problem/problem');
const router = express.Router({mergeParams: true})

router.get('/:code/comment',(req,res) => {
    const code = req.params.code;
    Problem.findOne({'code':code}).then((problem)=>{
        res.json({
            'success':true,
            msg: problem.comments
        })
    }).catch(()=>{
        res.json({
            'success':false,
            'msg': 'Problem code invalid'
        })
    })
});

router.post('/:code/comment',(req,res) => {
    const code = req.params.code;
    //console.log(code);
    Problem.findOne({'code':code}).then((problem)=>{
        problem.comments.push({
            comment: req.body.comment,
            username: req.body.username
        });
        problem.save().then(() => {
            res.json({
                'success':true,
                 msg: 'Successfully Added'
            })
        });
    }).catch(()=>{
        res.json({
            'success':false,
            'msg': 'Problem code invalid'
        })
    })
});

router.delete('/:code/comment', (req, res) => {
    const code = req.params.code;
    const comment = req.body.comment;
    const username = req.body.username;
    Problem.findOne({'code':code}).then((problem)=>{
        for(let i=0; i<problem.comments.length; i++){
            if(problem.comments[i].comment === comment && problem.comments[i].username === username){
                problem.comments.splice(i,1);
                i--;
            }
        }
        problem.save().then(() => {
            res.json({
                'success':true,
                 msg: 'Successfully Removed'
            })
        });
    }).catch(()=>{
        res.json({
            'success':false,
            'msg': 'Problem code invalid'
        })
    })
});


module.exports = router;