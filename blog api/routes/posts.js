const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('We are on posts');
});

router.get('/specific', (req, res) => {
    res.send('Specific posts');
});


module.exports = router;