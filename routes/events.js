var express = require('express');
var router = express.Router();

/* GET events "home" page - a list of all events. */
router.get('/', function(req, res, next) {
  res.render('events', { title: 'Events', style: "tables.css"});
});

router.get('/1', function(req, res, next) {
  res.render('event', { title: 'Event Details', styles: ["tables.css", "event.css"]});
});

module.exports = router;
