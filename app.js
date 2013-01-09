var express = require('express');
var app = express();

var exec = require('child_process').exec;
var gitLog = {
		log: "",
		ncommits : 0, 
		commits : [],
		parse: function(log) {
			this.log = log.split("\n");
			this.ncommits = (this.log.length / 6);
			this.commits = [];
			for (var i=0; i< this.log.length; i+=(this.ncommits-1)){
					var commit ={
							// Commit hash line -> commit: {hash_commit}
							hash : this.log[i+0].split(" ")[1],
							// Author line -> Author: {name} <{email}>
							authorInfo : {	name: this.log[i+1].split(" ")[1], email: this.log[i+1].split(" ")[2] }, 
							// Date line -> Date: {date}
							date : this.log[i+2].split("Date:   ")[1],
							// Comment line -> {comment}
							comment : this.log[i+4].split("    ")[1]       		         		     				
					}
					this.commits.push( commit )
			}
			return this.commits;
		},
		toString: function() {
			return log;
		}
}; 

exec('git log', function (error, gitLogOutput) {
		var log = gitLog.parse(gitLogOutput);
		// Debug mode. printing out the first commit comment
		console.log(log[0]["comment"]);
});



app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000);
console.log('Listening on port 3000');