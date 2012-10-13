var GitHubApi = require("github"),
	fs = require('fs'),
	markov = require('markov');

var github = new GitHubApi({
    version: "3.0.0"
}),
	filename = "smooth-breeze-corpus.txt",
	gist_id = 3806778,
	initialized = false,
	corpus = "",
	m = markov(1);

var set = function(text,callback) {
	corpus = text;
	var f = corpus,
		s = f.toString();
	s = s.replace(/\n/i,' ').replace(/[\(\)\"\“\”]+/gim,"");
	m.seed(s, function() {
		if (callback) callback(text);
	});
	return true;
}

var get = function() {
	var s = sentence();
	while (s) {
		if (s.length >= 5 && s.length <= 20) break;
		s = sentence();
	}
	return s.join(' ');
}

var sentence = function() {
	var key = m.pick(),
		res = [],
		currentWord,
		currentKey = key,
		finished = false;

	var exceptions = {"this":true,"there":true,"with":true,"over":true,"they":true,"every":true,"just":true,"most":true};

    while (currentKey) {
        var next = m.next(currentKey);
        if (!next) break;
        if (currentWord && currentWord.charAt(currentWord.length-1) == ("." || "?" || "!") ) break;
        currentKey = next.key;
    	currentWord = next.word;
    	if ( currentWord.toLowerCase() !== "i" && ( currentWord.length <= 3 || exceptions[currentWord.toLowerCase()] === true ) ) currentWord = currentWord.toLowerCase();
    	if (res.length == 0) currentWord = currentWord.charAt(0).toUpperCase() + currentWord.slice(1);
        res.push(currentWord);
    }

   	return res;
}

var save = function(text) {
	refresh(function(previous) {
		var updatedText = previous + " \n" + text;
			updatedFiles = {},
			updatedFiles[filename] = {"content": updatedText.replace(/[\u007f-\uffff]/g,'') };
		// OAuth2
		github.authenticate({
		    type: "oauth",
		    token: process.env.github_token
		});
		github.gists.edit({
		    "id":gist_id,
		    "files":updatedFiles
		}, function(err, res) {
			if (err) {
				return;
			}
		   if (res.files[filename])  {
		   		set(res.files[filename].content);
		   }
		});

	});
}

var refresh = function(callback) {

	github.gists.get({
	    id:gist_id
	}, function(err, res) {
		var refreshedText = (res.files[filename] && res.files[filename].content) ? res.files[filename].content : "";
	    set(refreshedText,callback);
	});

}

exports.save = save;
exports.refresh = refresh;
exports.get = get;