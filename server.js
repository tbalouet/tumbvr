var express = require('express');
var app     = express();

var tumblr = require('tumblr.js');

var key = process.env.TUMBLR_KEY || "YOUR_KEY_HERE";
if(key === "YOUR_KEY_HERE"){
  console.error("You have to set your Tumblr API key to make the project work: https://www.tumblr.com/oauth/apps");
}
else{
  //Tumblr Client to retrieve images from accounts
  var tumbClient = tumblr.createClient({ consumer_key: key });

  app.use('/public/', express.static(__dirname + '/public/', {maxAge : 86400000}));

  function routeTumbVR(req, res){
    var tumbID = req.params[0];
    if(tumbID === undefined || tumbID === ""){
      tumbID = "welovepaintings";
    }
    // Make the request to retrieve posts from tumblr
    tumbClient.blogPosts(tumbID+'.tumblr.com', { type: 'photo', filter: 'text' }, function (err, data) {
      if(data === null){
        tumbClient.blogPosts('welovepaintings.tumblr.com', { type: 'photo', filter: 'text' }, function (err, data) {
            res.render('tumbvr_index.ejs', {mainFile : "/public/js/tumbvr_prod.js", aFrameFile : "/public/js/aframe-v0.7.1.min.js", tumblrdata : data});
        });
      }
      else{
          res.render('tumbvr_index.ejs', {mainFile : "/public/js/tumbvr_prod.js", aFrameFile : "/public/js/aframe-v0.7.1.min.js", tumblrdata : data});
      }
    });
  };

  app.get('/*', routeTumbVR);
  app.get('/', routeTumbVR);

  app.listen(process.env.PORT);
  console.log('Listening on port ' + process.env.PORT);
}
