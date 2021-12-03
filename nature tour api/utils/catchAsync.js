/** function to take catch async function */

module.exports = fn => {
    // next help to catch the error
    return (req, res, next) => {
      fn(req, res, next).catch(next)  
    };
};

