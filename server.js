// ** Imports start **
//initialzed dotenv package to use .env variables inside our project
require('dotenv').config();

// expressjs import
const express = require('express')

// custom logger middleware import
const {logger,logEvents}=require('./middleware/logger');

// custom error handler middleware
const errorHandler = require('./middleware/errorHandler')

// 3rd party dependecy / cors
const cors = require('cors')

//import custom CORS options
const corsOptions = require('./config/corsOptions')

// 3rd party cookieParser
const cookieParser=require('cookie-parser');

//mongoose db conn initialization
const connectDB = require('./config/dbConn')
//mongoose initialization
const mongoose = require('mongoose')

// ** Improts Ends **

// database connectivity intialization
connectDB()

// expressjs initialization
const app= express()

// pathfinder required
const path = require('path')

// PORT initialization
const PORT  = process.env.PORT || 5500


//logger initialization
app.use(logger);

// CORS initialization
app.use(cors(corsOptions));

//built in middlewares
app.use(express.json());

// cookie parser 3rd party middleware
app.use(cookieParser());


//using static files with in the app if required | it's a middleware
app.use('/', express.static(path.join(__dirname,'public')));
// app.use('/', require('./'))

// rootjs file handler initialization
app.use('/',require('./routes/root'));

//routing 
app.use('/users',require('./routes/userRoutes'))

// custom 404 error handler
app.all('*',(req,res)=>{
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));

    }else if(req.accepts('json')){
        res.json('404 not found');
    }else{
        res.type('txt').send('404 not found');
    }
})


//initializing error handler middleware
app.use(errorHandler);
mongoose.connection.once('open',()=>{
    console.log('Connected to db socket')
    app.listen(PORT,()=>{
        console.log(`server runnning on ${PORT}`)
    })
})
//Mongodb connectivity error defined here with logger for further analytics
mongoose.connection.on('error',err=>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})