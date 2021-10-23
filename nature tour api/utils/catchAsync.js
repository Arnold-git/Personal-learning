module.exports = fn => {
    // next help to catch the error
    return (req, res, next) => {
      fn(req, res, next).catch(err => next(err))  
    };
};

