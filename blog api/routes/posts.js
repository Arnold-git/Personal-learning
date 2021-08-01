const express = require('express');
const router = express.Router();
const Post = require('../models/Post');



router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts)
    } catch (err) {
        res.json({ message: err });
    }
});


router.post('/', async (req, res) =>{
    const post = new Post({
        title: req.boby.title,
        description: req.boby.description
    });

    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({ message: err});
    }


});


router.get('/:postId', (res, req) =>{
    console.log
})

module.exports = router;