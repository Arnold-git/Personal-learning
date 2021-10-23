const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')




exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name, price, ratingAverage, summary, difficulty";
  next();
}



exports.getAllTours = catchAsync(async (req, res, next) => {

    console.log(req.query)
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()     
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: "Success",
      results: tours.length,
      data: {
        tours
      }
    });
  
})

exports.getTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findById(req.params.id);
    
    if(!tour) {
      return next(new AppError("No tour found with that ID", 404))
    }

    res.status(200).json({
      status: "Success",
      data: {
        tour
      }
    });
});





exports.createTour = catchAsync(async (req, res, next) => {

  const newTour = await Tour.create(req.body);
  
    res.status(200).json({
      status: 'successfully created a tour',
      data: {
        tour: newTour
      }
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: "Sucess",
      data: {
        tour
      }
    });

});



exports.deleteTour =catchAsync( async (req, res) => {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "Success",
      data: null
    })

});


exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } }
      },
      {
        $group: { 
          _id: { $toUpper: '$difficulty'},
          numTours: { $sum: 1},
          numRatings: { $sum: '$ratingQuantity'},
          avgRating: { $avg: '$ratingAverage'},
          avgPrice: { $avg: '$price'},
          minPrice: { $min: '$price'},
          maxPrice: {$max: '$price'}
        }
      },
      {
        $sort: {
          avgPrice: 1
        }
      },
      // {
      //   $match: {
      //     _id: {
      //       $ne: 'EASY'
      //     }
      //   }
      // }
    ]);

    res.status(200).json({
      status: "Success",
      data: {
        stats
      }
    });
});


exports.getMonthlyPlan = catchAsync(async  (req, res, next) => {

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates'},
          numTourStarts: { $sum: 1},
          tours: { $push: '$name' }, 
          difficulty: { $push: '$difficulty'}
          
        }
      },
    {
      $addFields: { month: '$_id'}
    },
    {
      $project: {
        _id: 0
      }
    }, 
    {
      $sort: { numTourStarts: -1 }
    //   $sort: { month: -1, numTourStarts: -1 }
    },
    // {
    //   $limit: 3
    // }
    ])

    res.status(200).json({
      status: "Success",
      data: {
        plan
      }
    });
});