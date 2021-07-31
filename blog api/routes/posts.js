const express = require('express');
const router = express.Router();
const Posts = require('../models/Post');


router.get('/', (req, res) => {
    res.send('We are on posts');
});


router.post('/', (req, res) =>{
    res.send(req.body)

});

module.exports = router;