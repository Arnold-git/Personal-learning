const express = require('express')
const app = express();
const morgan = require('morgan');

const userRouter = require('./Routes/user');



app.use(express.json())

app.use(morgan('dev'))
app.use('/user', userRouter)

app.use('/', (req, res, next) =>{
    res.status(200).json({
        message: "Hello world"
    })
});





module.exports = app;