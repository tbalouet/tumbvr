var express = require('express');
var app     = express();

var Config  = require('./config'),
	conf    = new Config();

var tumblr = require('tumblr.js');

var cors_proxy = require('cors-anywhere');

//Force launching server with environment variables
if(conf.error){
	console.error("Please define environment with NODE_ENV=dev/prod node server.js, not "+conf.nodeenv);
	return;
}

//CORS PROXY to enable fetching images from other servers
var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
var port = process.env.PORT || 8080;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});

var key = process.env.TUMBLR_KEY || "YOUR_KEY_HERE";
if(key === "YOUR_KEY_HERE"){
	console.error("You have to set your Tumblr API key to make the project work: https://www.tumblr.com/oauth/apps");
	return;
}
//Tumblr Client to retrieve images from accounts
var tumbClient = tumblr.createClient({ consumer_key: key });


app.use(express.static(__dirname + '/public', {maxAge : conf.maxAge}));

app.get('/', function(req, res){
	res.render('home.ejs', {aFrameFile : conf.aFrameFile});
});

app.get('/tumbvr', function(req, res){
	if(req.params[0] === ""){
		req.params[0] = "aframevr";
	}
	// Make the request to retrieve posts from tumblr
	tumbClient.blogPosts(req.params[0]+'.tumblr.com', { type: 'photo', filter: 'text' }, function (err, data) {
  		res.render('index.ejs', {mainFile : conf.mainFile, aFrameFile : conf.aFrameFile, tumblrdata : data});
	});
});

app.listen(conf.port);
console.log('Listening on port ' + conf.port);