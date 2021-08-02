const express = require('express')
const app = express();

app.use('/user', (req, res, next) =>{
    res.status(200).json({
        message: "User request"
    })
})

app.use('/', (req, res, next) =>{
    res.status(200).json({
        message: "Hello world"
    })
});





module.exports = app;