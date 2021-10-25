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
).then(() => console.log('DB connection successfully'))

const port = process.env.PORT || 8080

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});


// error handler for unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log('UNHANDLE REJECTION... ')
    console.log(err);
    // server.close(() => {
    //     process.exit(1)
    // });
});

// error handler for unhandled exception

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION');
    console.log(err)
})
