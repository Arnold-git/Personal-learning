const Tour = require('./../models/tourModel')





exports.getAllTours = async (req, res) => {


  try {
    const queryObj = {...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    // console.log(req.queryObj)

    const tours = await Tour.find(queryObj);

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
