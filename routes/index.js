var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HackBCA 20XX', style: "index" });
});

module.exports = router;
