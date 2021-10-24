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

  if (err.Operational) {

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
    })
  }
}


module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {

      SendErrorDev(err, dev)

    } else if (process.env.NODE_ENV === 'productionn') {

      sendErrorProd(res, err)

    }    
}