
/**
 * Module dependencies.
 */

var express = require('express')
  util = require('util'),
  fs = require('fs'),
  markov = require('markov'),
  routes = require('./routes'),
  corpus = require('./corpus'),
  stache = require('stache');


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'mustache');
  app.register('.mustache', stache);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/add', routes.add);

app.post('/add', routes.add);

corpus.refresh(function() {
  app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });
});