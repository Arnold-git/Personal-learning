const express = require('express')
const app = express();
const mongoose = require('mongoose')
require('dotenv/config')
const morgan = require('morgan');

const userRouter = require('./Routes/user');

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
    console.log('Database connected');
}).catch(err=>{
    console.log('Database not connected' + err)
});

app.use(morgan('dev'))
app.use(express.json())

app.use((req,res,next)=>
{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization'
        );

        if(req.method==='OPTIONS')
        {
            res.header('Accept-Control-Methods','PUT,POST,PATCH,DELETE,GET');
            return res.status(200).json({

            })
        }
        next();
});


app.use('/user', userRouter)

app.use('/', (req, res, next) =>{
    const error = new Error('Not found');
    next(error);

});


app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })

});


module.exports = app;