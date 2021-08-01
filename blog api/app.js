const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv/config')



app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));


const postRoute = require('./routes/posts');
app.use('/posts', postRoute);







mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
    console.log('Database connected')
}).catch(err=>{
    console.log('Database could not connect'+err);
})


app.get('/', (req, res) =>{
    res.send('This is default route');
});





const port = process.env.PORT || 3000;
app.listen(3000, function () {
    console.log(`Listening on port ${port}...`);
});
