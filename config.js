module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'dev':
            return {
            	mainFile : "tumbvr_dev.js",
                aFrameFile : "aframe.js",
            	maxAge : 1,//Set short maxage to allow no cache
            	port : 3000
            };
        case 'prod':
        case 'production':
            return {
            	mainFile : "tumbvr_prod.js",
                aFrameFile : "aframe.min.js",
            	maxAge : 86400000,//One day cache
            	port : 80
            };

        default:
            return {error : true, nodeenv : process.env.NODE_ENV};
    }
};