var express = require('express');
var app = express();


var exec = require('child_process').exec;

exec('git log', function (error, gitLogOutput) {
    var log = new gitLog(gitLogOutput);
    // Debug mode. printing out the first commit comment
    console.log(log.commits[0].comment);
});



app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000);
console.log('Listening on port 3000');