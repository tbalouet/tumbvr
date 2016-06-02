var express = require('express');
var app     = express();

var Config  = require('./config'),
	conf    = new Config();

var tumblr = require('tumblr.js');

var cors_proxy = require('cors-anywhere');

if(conf.error){
	console.log("Please define environment with NODE_ENV=dev/prod node server.js");
	return;
}

var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
var port = process.env.PORT || 8080;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});

var client = tumblr.createClient({ consumer_key: 'YOUR_KEY_HERE' });

app.use(express.static(__dirname + '/public', {maxAge : conf.maxAge}));

app.get('/*', function(req, res){
	// Make the request
	client.blogPosts(req.params[0]+'.tumblr.com', { type: 'photo', filter: 'text' }, function (err, data) {
  		res.render('index.ejs', {mainFile : conf.mainFile, tumblrdata : data});
	});
});

app.listen(conf.port);
console.log('Listening on port ' + conf.port);