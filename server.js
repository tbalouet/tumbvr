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


app.use(express.static(__dirname + 'tumbvr/public', {maxAge : conf.maxAge}));
app.use('/tumbvr', express.static('public'));

app.get('/', function(req, res){
	res.render('home.ejs', {aFrameFile : conf.aFrameFile});
});

function routeTumbVR(req, res){
	var tumbID = req.params[0];
	if(tumbID === undefined || tumbID === ""){
		tumbID = "aframevr";
	}
	// Make the request to retrieve posts from tumblr
	tumbClient.blogPosts(tumbID+'.tumblr.com', { type: 'photo', filter: 'text' }, function (err, data) {
		if(data === null){
			tumbClient.blogPosts('aframevr.tumblr.com', { type: 'photo', filter: 'text' }, function (err, data) {
		  		res.render('index.ejs', {mainFile : conf.mainFile, aFrameFile : conf.aFrameFile, tumblrdata : data});
			});
		}
		else{
  			res.render('index.ejs', {mainFile : conf.mainFile, aFrameFile : conf.aFrameFile, tumblrdata : data});
		}
	});
};

app.get('/tumbvr/*', routeTumbVR);
app.get('/tumbvr', routeTumbVR);

app.listen(conf.port);
console.log('Listening on port ' + conf.port);