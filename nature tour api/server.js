const mongoose = require('mongoose');
const dotenv = require('dotenv');



// error handler for unhandled exception
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION');
    console.log(err.name, err.message);
    process.exit(1);
});

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

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ${PORT} 🛡️
    ################################################
    SERVER IN ${process.env.NODE_ENV} MODE
  `);
});


// error handler for unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log('UNHANDLE REJECTION... ')
    console.log(err.name, err.message);
    // server.close(() => {
    //     process.exit(1)
    // });
});





