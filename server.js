const express = require('express')
const app= express()
const path = require('path')
const PORT  = process.env.PORT || 5500
//built in middlewares
app.use(express.json());

//using static files with in the app if required | it's a middleware
app.use('/', express.static(path.join(__dirname,'public')));
// app.use('/', require('./'))
app.use('/',require('./routes/root'));
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

app.listen(PORT,()=>{
    console.log(`server runnning on ${PORT}`)
})