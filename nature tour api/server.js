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

app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
})
