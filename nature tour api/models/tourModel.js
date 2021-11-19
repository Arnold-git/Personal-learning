const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator')



const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique:  true,
        trim: true,
        maxlength: [40, 'Name must have less than or equal 40 charactrers'],
        minlength: [10, 'Name must have atleast 10 characters'],

        // validation with third party api
        // validate: {
        //     validator: function (val) {
        //         const valNoSpaces = val.split(' ').join('');
        //         return validator.isAlpha(valNoSpaces, 'en-GB');
        //     },
        //     message: 'String have to contain only alphanumeric with spaces'
        // }
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
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: '{VALUE} not supported'
        }

    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'rating average must atleast 1'],
        max: [5, 'rating cannot be above 5'],
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        /** this only points to new document creation */
        validate: {
            validator: function(val) {
                return val < this.price
            },
            message: 'Discount price {VALUE} should be less than regular price {this.price}'
        }
    },
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
    secretTour: {
        type: Boolean,
        default: false
    },

}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

/** vitual property */
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

/** Document middleware */
/** only works for .save() and .create(). Doesnt work with updateMany */
tourSchema.pre('save', function(){
    this.slug = slugify(this.name, {lower: true});
    next();
});

// tourSchema.pre('save', function(){
//     console.log('Will save document...');
//     next();
// });


// tourSchema.post('save', function(doc, next){
//     console.log(doc);
//     next();
// })

/** query middleware */
tourSchema.pre(/^find/, function(next){
    this.find({ secretTour: {$ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    // console.log(docs);
    next();
});

/** aggregation middleware */
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift( {$match: { secretTour: { $ne: true } }})
    next();
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;