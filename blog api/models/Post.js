const mongoose = require('mongoose')


const PostSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    }

});


module.exports = momgoose.model('Posts', PostSchema);