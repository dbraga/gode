var express = require('express');
var watch = require('node-watch');
var exec_path = require('path').dirname(require.main.filename);
var events = require('events');
var exec = require('child_process').exec;

var gitLog = {
    log: "",
    ncommits : 0,
    commits : [],
    parse: function(log) {
      this.log = log.split("\n");
      this.ncommits = this.log.length;
      this.commits = [];
      for (var i=0; i<this.ncommits; i++){
        var commit = {
          // Commit hash line ->  {hash_commit}
          hash : this.log[i].split("  ")[0],
          // Author line -> Author: {name} <{email}>  
          authorInfo : {  name: this.log[i].split("  ")[1], email: this.log[i].split("  ")[2] },
          // Date line -> Date: {date}
          date : this.log[i].split("  ")[3],
          // Comment line -> {comment}
          comment : this.log[i].split("  ")[4],
          index : this.ncommits - i     
        }
        this.commits.push( commit );
      }
      return this.commits.reverse();
    },
    toString: function() {
      return log;
    }
};

var Git = function () {};
Git.prototype = new events.EventEmitter;

var gitlog = new Git();

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.configure(function(){
  app.use('/media', express.static(__dirname + '/media'));
  app.use(express.static(__dirname + '/public'));
});

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');

});

io.sockets.on('connection', function (socket) {

  exec('git log --pretty=format:"%h  %an  %ae  %ad  %s"', function (error, gitLogOutput) {
  // Send the full git log
    socket.emit("full-git-log",gitLog.parse(gitLogOutput));
  });



  gitlog.on('commit', function (commit) {
    socket.emit('test', commit);
  });
});


watch(exec_path +'/.git/refs/heads', function(filename) {
  exec('git log --pretty=format:"%h  %an  %ae  %ad  %s"', function (error, gitLogOutput) {
      var log = gitLog.parse(gitLogOutput);
      // gitlog.emit('commit', log[0]);
      gitlog.emit('commit', log);

  });
});

