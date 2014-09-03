var express = require('express');
var router = express.Router();

/* GET homepage. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Home' });
});

module.exports = router;
