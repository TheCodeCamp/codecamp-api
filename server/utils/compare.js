module.exports.compare = function(a,b){
    if(a.score === b.score){
        return a.time-b.time;
    }
    else{
        return b.score-a.score;
    }
}