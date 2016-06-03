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
var port = 8080;

// Grab the blacklist from the command-line so that we can update the blacklist without deploying
// again. CORS Anywhere is open by design, and this blacklist is not used, except for countering
// immediate abuse (e.g. denial of service). If you want to block all origins except for some,
// use originWhitelist instead.
var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

cors_proxy.createServer({
	originBlacklist: originBlacklist,
	originWhitelist: originWhitelist,
	requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: [
		'cookie',
		'cookie2',
		// Strip Heroku-specific headers
		'x-heroku-queue-wait-time',
		'x-heroku-queue-depth',
		'x-heroku-dynos-in-use',
		'x-request-start',
	],
	redirectSameOrigin: true,
	httpProxyOptions: {
		// Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
		xfwd: false,
	},
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