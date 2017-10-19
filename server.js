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
var host = '0.0.0.0';
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


app.use('/public/', express.static(__dirname + '/public/', {maxAge : conf.maxAge}));

function routeTumbVR(req, res){
	var tumbID = req.params[0];
	if(tumbID === undefined || tumbID === ""){
		tumbID = "welovepaintings";
	}
	// Make the request to retrieve posts from tumblr
	tumbClient.blogPosts(tumbID+'.tumblr.com', { type: 'photo', filter: 'text' }, function (err, data) {
		if(data === null){
			tumbClient.blogPosts('welovepaintings.tumblr.com', { type: 'photo', filter: 'text' }, function (err, data) {
		  		res.render('tumbvr_index.ejs', {mainFile : conf.mainFile, aFrameFile : conf.aFrameFile, tumblrdata : data});
			});
		}
		else{
  			res.render('tumbvr_index.ejs', {mainFile : conf.mainFile, aFrameFile : conf.aFrameFile, tumblrdata : data});
		}
	});
};

app.get('/*', routeTumbVR);
app.get('/', routeTumbVR);

app.listen(conf.port);
console.log('Listening on port ' + conf.port);
