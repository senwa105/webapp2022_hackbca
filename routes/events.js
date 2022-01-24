var express = require('express');
var router = express.Router();

const mysql = require('mysql');

const dbConfig = {
  host: "<HOSTNAME>", // hostname / domain,
  port: 3306,
  user: '<USER>',
  password: '<PASSWORD>', // Hmm, this should definitely NOT be in plain text...
  database: 'hackbca_example',
  connectTimeout: 10000
}

let connection = mysql.createConnection(dbConfig);

connection.connect(function(err){
  if (err) 
    throw err;
  console.log("Connected to the MySQL Server!");
})

/* GET events "home" page - a list of all events. */
router.get('/', function(req, res, next) {
  res.render('events', { title: 'Events', style: "tables"});
});

router.get('/create', function(req, res, next) {
  res.render('eventform', {title: "Create Event", style: "newevent"})
})

let singleEventQuery = `
SELECT 
	event.event_id as event_id, 
    event_name, 
    event_duration,
    event_type,
    DATE_FORMAT(event_dt, '%Y-%m-%d') as event_date_ymd,
    DATE_FORMAT(event_dt, '%b %d (%a)') as event_date,
    DATE_FORMAT(event_dt, '%l:%i %p') as event_time,
    event_location,
    event_description,
    event_interest
FROM 
	event LEFT JOIN (
		SELECT COUNT(*) as event_interest, event_id 
        FROM event_user_registration
		GROUP BY event_id
	) as event_user_counts ON event.event_id = event_user_counts.event_id,
    event_location, event_type
WHERE
	event.event_location_id = event_location.event_location_id
    and event.event_type_id = event_type.event_type_id
    and event.event_id = ?
LIMIT 1
`


router.get('/:event_id', function(req, res, next) {
  let event_id = req.params.event_id
  // GET FROM DATABASE: Select query where event_id = event_id from URL
  //For now, lets pretend
  // let event_data = {event_id: event_id,
  //                 event_name: "Opening Ceremony", 
  //                 event_location: "Auditorium",
  //                 event_date: "May 1 (Sat)",
  //                 event_time: "10:30 AM",
  //                 event_duration: "30m",
  //                 event_type: "Main",
  //                 event_interest: "100",
  //                 event_description: "Be there!"}
  connection.query(singleEventQuery, [event_id], (err, results) => {
    if (err)
      next(err);
    console.log(results);
    let event_data = results[0];
    res.render('event', { title: 'Event Details', 
                      styles: ["tables", "event"], 
                      event_id : event_id, 
                      event_data: event_data});
  });
});

router.get('/:event_id/modify', function(req, res, next) {
  res.render('eventform', {title: "Modify Event", style: "newevent"})
})

module.exports = router;
