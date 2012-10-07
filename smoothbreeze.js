var util = require('util');
var fs = require('fs');

var markov = require('markov');
var m = markov(5);

var s = fs.createReadStream(__dirname + '/text.txt');
m.seed(s, function () {
	console.log(m.pick());
    var res = m.fill(m.pick(),5).join(' ');
    console.log(res);
});