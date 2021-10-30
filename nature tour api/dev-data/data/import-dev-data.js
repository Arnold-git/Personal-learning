const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')




dotenv.config({ path: "./.env"});



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


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data Successfully loaded')
        
    } catch (err) {
        console.log(err)
    }
    process.exit()
}

const deleteData = async() => {
    try {
        await Tour.deleteMany();
        console.log("Data successfully deleted")
        
    } catch (err) {
        console.log(err)
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv)

