const mongoose = require('mongoose');
const dotenv = require('dotenv');



dotenv.config();
const app = require('./app')


const DB = process.env.DATABASE

mongoose.connect(
    DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
).then(() => console.log('DB connection successfully')).catch(
    err => {console.log(err)
});


const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});


