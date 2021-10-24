const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {

  const value = err.ermsg.match(/["'])(\\?.)*?\1/)[0]

  console.log(value)

  const message = "Duplicate field value: x. Please use another value";

  return new AppError(message, 400);
};

const SendErrorDev = (err, res) => {
  res.status(err.statusCode).json({

    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack

  });
}

const sendErrorProd = (err, res) => {

  // Operational error, send message to client 

  if (err.isOperational) {

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
  
    });

    // programming or other unknown errror

  } else {

    // log error
    console.error('ERROR ', err)

    // send generic message to client
    res.status(500).json({
      status: "error",
      message: "Something went wrong"
    });
  }
}


module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {

      SendErrorDev(err, res)

    } else if (process.env.NODE_ENV === 'production') {

      let error = { ...err };

      if (error.name === 'CastError') error = handleCastErrorDB(error);
      
      if (error.code === 11000) error = handleDuplicateFieldsDB(error)

      sendErrorProd(error, res)

    }    
}