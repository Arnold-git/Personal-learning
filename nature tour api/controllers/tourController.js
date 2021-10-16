const Tour = require('./../models/tourModel')


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name, price, ratingAverage, summary, difficulty";
  next();
}

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryStr = queryString;
  }

  filter() {
    const queryObj = {...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    // Advanced filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }

  sort() {
    if(this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;

  }

  limitFields() {
    if(this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ")
      this.query = query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }

    return this;
  }

  paginate(){

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit)

    return this;
  }
  
}

exports.getAllTours = async (req, res) => {


  try {

    // Filtering
    // const queryObj = {...req.query };
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // excludeFields.forEach(el => delete queryObj[el]);

    // // Advanced filtering

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr));
    

    // let query = Tour.find(JSON.parse(queryStr))

    // sorting


    // if(req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt')
    // }

    // field limiting

    // if(req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ")
    //   query = query.select(fields)
    // } else {
    //   query = query.select('-__v')
    // }
    
    // pagination

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit)

    // if (req.query.page) {
    //   const numTours = await tours.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exit');
    // }

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
