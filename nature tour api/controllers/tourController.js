const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name, price, ratingAverage, summary, difficulty";
  next();
}



exports.getAllTours = async (req, res) => {


  try {

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

  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err
    })
  }
  
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // same as
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: "Sucess",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "Faild",
      message: err
    })
  }
};





exports.createTour = async (req, res) => {
  try {
    
    const newTour = await Tour.create(req.body);
  
    res.status(200).json({
      status: 'successfully created a tour',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: "Invalid data sent"
    })
  }
};

exports.updateTour = async (req, res) => {

  try{

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


  } catch(err) {
    res.status(404).json({
      status: "failed",
      message: err
    });

  }

};



exports.deleteTour = async (req, res) => {

  try {

    const tour = await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "Success",
      data: null
    })

  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err
    })
  }

};


exports.getTourStats = async (req, res) => {
  try{

    const stats = Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } }
      },
      {
        $group: { 
          _id: null,
          avgRating: { $avg: '$ratingAverage'},
          avgPrice: { $avg: '$price'},
          minPrice: { $min: '$price'},
          maxPrice: {$max: 'price'}
        }
      }
    ])

  } catch {
    res.status(404).json({
      status: "Failed",
      message: err
    })
  }
}
