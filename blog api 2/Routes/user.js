const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.status(200).json({
        message: "user request route"
    });
});


router.post('/', (req, res, next) =>{
    res.status(200).json({
        message: "user request route"
    });
});

router.put('/', (req, res, next) =>{
    res.status(200).json({
        message: "user request route"
    });
});


router.patch('/', (req, res, next) =>{
    res.status(200).json({
        message: "user request route"
    });
});

router.delete\

('/', (req, res, next) =>{
    res.status(200).json({
        message: "user request route"
    });
});


module.exports = router