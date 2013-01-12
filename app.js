var express = require('express');
// var app = express();

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
      this.ncommits = (this.log.length / 6);
      this.commits = [];
      for (var i=0; i< this.log.length; i+=(this.ncommits-1)){
          var commit ={
              // Commit hash line -> commit: {hash_commit}
              hash : this.log[i+0].split(" ")[1],
              // Author line -> Author: {name} <{email}>
              authorInfo : {  name: this.log[i+1].split(" ")[1], email: this.log[i+1].split(" ")[2] },
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

var Git = function () {};
Git.prototype = new events.EventEmitter;

var gitlog = new Git();

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  gitlog.on('commit', function (commit) {
    socket.emit('test', commit);
  });
});


  watch(exec_path +'/.git/refs/heads', function(filename) {
    exec('git log', function (error, gitLogOutput) {
        var log = gitLog.parse(gitLogOutput);
        gitlog.emit('commit', log[0]);
    });
  });

