module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'developemnt') {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });

    } else if (process.env.NODE_ENV ==='production') {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      

    }
  

}