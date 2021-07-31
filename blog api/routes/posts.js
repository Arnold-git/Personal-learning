const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const Posts = require('../models/Post');


router.get('/', (req, res) => {
    res.send('We are on posts');
});


router.post('/', (req, res) =>{
    const post = new Post({
        title: req.boby.title,
        description: req.boby.description
    });

   post.save()
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        res.json({ message: err });
    });


});

module.exports = router;