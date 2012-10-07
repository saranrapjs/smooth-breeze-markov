var corpus = require("../corpus.js");
/*
 * GET home page.
 */

exports.index = function(req, res){

	var text = corpus.get();
		res.render('index', {
		    locals: {
		        text : text
		    }
		});

};

exports.add = function(req,res) {
	if (req.route.method == "post") {
		var posted = req.body.text;
		corpus.save(posted);
	}

	res.render('add', {});

}