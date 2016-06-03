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

var key = process.env.TUMBLR_KEY || "YOUR_KEY_HERE";
if(key === "YOUR_KEY_HERE"){
	console.error("You have to set your Tumblr API key to make the project work: https://www.tumblr.com/oauth/apps");
	return;
}

//Tumblr Client to retrieve images from accounts
var tumbClient = tumblr.createClient({ consumer_key: key });

app.set('port', (process.env.PORT || conf.port));
app.use(express.static(__dirname + '/public', {maxAge : conf.maxAge}));

app.get('/*', function(req, res){
	if(req.params[0] === ""){
		req.params[0] = "aframevr";
	}
	// Make the request to retrieve posts from tumblr
	tumbClient.blogPosts(req.params[0]+'.tumblr.com', { type: 'photo', filter: 'text' }, function (err, data) {
  		res.render('index.ejs', {mainFile : conf.mainFile, aFrameFile : conf.aFrameFile, tumblrdata : data});
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});