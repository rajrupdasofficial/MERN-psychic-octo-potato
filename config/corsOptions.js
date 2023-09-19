const allowedOrigins = require('./allowedOrigins');
// custom CROS options to set who can able to access the api 
const corsOptions = {
    origin:(origin,callBack)=>{
        // not form any unknow origin or not from any other origin only to whome given access
        if(allowedOrigins.indexOf(origin)!==-1|| !origin){
            callBack(null,true)
        }else{
            callBack(new Error('Not allowed by CORS'));
        }
    },
    credentials:true,
    optionsSuccessStatus:200
}

module.exports = corsOptions;