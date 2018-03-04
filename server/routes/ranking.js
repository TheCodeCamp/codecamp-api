const express = require('express');
const router = express.Router();

const User = require('./../models/user/user');
const Contest = require('./../../contest/models/contest/contest');
const {compare} = require('./../utils/compare');

router.get('/:id',(req,res)=>{
  
    const id = req.params.id;
    Contest.findOne({'id':id},(err,contest)=>{
    
        const startTime = contest.startTime;
        User.find({'contest':{"$elemMatch":{'name':id}}},(err,users)=>{

           // console.log(users);
            /*var participant = {
                'username',
                problemSolved,
                score,
            }*/
            //console.log(startTime.getTime(),users[0].contest[0].problemSolved[0].submissionTime.getTime());
            var userTry = users.map(x=>{
                var index = x.contest.findIndex(y => y.name===id);
                if(index !== -1)
                {
                    let penality = 0;
                    let problemSolved = x.contest[index].problemSolved
                    const length = problemSolved.length;
                    let time = 0;
                    
                    for(let i=0;i<length;i++){
                        
                        if(problemSolved[i].submissionTime){

                            penality+=problemSolved[i].WA.length + problemSolved[i].TLE.length + problemSolved[i].RE.length;
                            time += Math.abs(startTime - problemSolved[i].submissionTime.getTime());

                        }
                    }
                    time += penality*10;

                    return {name:x.username,score:x.contest[index].count*100,time:time};
                }
            });
            res.json({'success': true, 'msg': userTry.sort(compare)})
        });

    })
})


module.exports = router;