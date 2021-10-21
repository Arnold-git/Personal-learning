const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique:  true,
        trim: true
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingAverage: {
        type: Number,
        default: 4.5
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],

}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

// vitual prperty
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// Document middleware
// only works for .save() and .create(). Doesnt work with updateMany
tourSchema.pre('save', function(){
    this.slug = slugify(this.name, {lower: true});
    next();
});

tourSchema.pre('save', function(){
    console.log('Will save document...');
    next();
});


tourSchema.post('save', function(doc, next){
    console.log(doc);
    next();
})

const Tour = mongoose.model('Tour', tourSchema)



module.exports = Tour;