module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'dev':
            return {
            	mainFile : "/public/js/tumbvr_dev.js",
              aFrameFile : "/public/js/aframe-v0.7.1.js",
            	maxAge : 1,//Set short maxage to allow no cache
            	port : 3000
            };
        case 'prod':
        case 'production':
            return {
            	mainFile : "/public/js/tumbvr_prod.js",
              aFrameFile : "/public/js/aframe-v0.7.1.min.js",
            	maxAge : 86400000,//One day cache
            	port : 80
            };

        default:
            return {error : true, nodeenv : process.env.NODE_ENV};
    }
};
