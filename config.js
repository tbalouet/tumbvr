module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'dev':
            return {
            	mainFile : "app.js",
            	maxAge : 1,//Set short maxage to allow no cache
            	port : 3000
            };

        case 'production':
            return {
            	mainFile : "prod.js",
            	maxAge : 86400000,//One day cache
            	port : 80
            };

        default:
            return {error : true};
    }
};