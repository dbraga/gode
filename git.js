var Class = function(methods) {   
    var klass = function() {    
        this.initialize.apply(this, arguments);          
    };  
    
    for (var property in methods) { 
       klass.prototype[property] = methods[property];
    }
          
    if (!klass.prototype.initialize) klass.prototype.initialize = function(){};      
    
    return klass;    
};

var author = Class({
		initialize: function(name, email){
			this.name = name;
			this.email = email; 
		}	
});

var commit = Class({ 
		initialize: function(hash,author,date,comment){
			this.hash = hash;
			this.author = author; 
			this.date = date;
			this.comment = comment;
		}
});

var gitLog = Class({ 
    initialize: function(log) {
        this.log = log.split("\n");
        this.ncommits = (this.log.length / 6);
        this.commits = [];
        for (var i=0; i< this.ncommits; i++){
        		// Commit hash line -> commit: {hash_commit}
        		var hash = this.log[(i*this.ncommits)+0].split(" ")[1];
        		// Author line -> Author: {name} <{email}>
        		var authorInfo = new author(this.log[(i*this.ncommits)+1].split(" ")[1], this.log[(i*this.ncommits)+1].split(" ")[2]);
        		// Date line -> Date: {date}
        		var date = this.log[(i*this.ncommits)+2].split("Date:   ")[1];
        		// Comment line -> {comment}
        		var comment = this.log[(i*this.ncommits)+4].split("    ")[1]; 
        		this.commits.push( new commit(hash, authorInfo, date, comment));
        }
    },
    toString: function() {
        return log;
    }
}); 