const express = require('express');
const router = express.Router();



router.post('/', (req, res, next) =>{
    res.status(200).json({
        message: "This is a post request route",
        "userName":req.body.name,
        "userAge": req.body.age
    });
});


router.get('/', (req, res, next) =>{
    res.status(200).json({
        message: "user request route"
    });
});


router.put('/', (req, res, next) =>{
    res.status(200).json({
        message: "This is a put request route"
    });
});


router.patch('/', (req, res, next) =>{
    res.status(200).json({
        message: "This is a patch request route"
    });
});


router.delete('/', (req, res, next) =>{
    res.status(200).json({
        message: "This is a delete request route"
    });
});


module.exports = router