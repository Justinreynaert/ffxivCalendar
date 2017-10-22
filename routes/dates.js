const express = require('express');
const router = express.Router();
const passport = require('passport');

const config = require('../config/database');

const Dates = require('../models/dates');

router.get('/', (req,res,next) => {
  res.json("test");
})

router.post("/setAvailability", passport.authenticate('jwt', {session:false}), (req,res) => {
  let date = {
    name: req.body.name,
    availability: req.body.availability,
    date: req.body.date
  }

  console.log("date in /setAvail - routes", date)
  Dates.setAvailibility(date, (err,data) => {
    if (err) {
      res.json({succes:false});
    } else {
      res.json({succes: true, data});
    }
  })

});


router.get('/getDates', (req, res, next) => {

  Dates.getAllDates(res);
});

router.get('/getDates/:date', function(req,res,next) {
  Dates.findByDate(req.params.date, function(err, data) {
    if(!err) {
      console.log(data);
      console.log(data.available);
      res.json({"available": data.available, "tentative": data.tentative, "unavailable": data.unavailable});
      //res.json(data);
    }
  })
})

router.post('/removeDate/:date', passport.authenticate('jwt', {session:false}), function(req,res,next) {
  Dates.removeDate(req.params.date, (err, data) => {
    if (err) {
      res.json({succes:false, msg:"fail"});
    } else {
      console.log(data.result);
      if (data.result.n > 0 ) {
        res.json({succes: true, msg: "date removed"})
      } else {
        res.json({succes: true, msg: "date not found"})
      }

    }
  })
})

router.post('/addDate/:date', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  console.log(req.params.date);

  let newDate = new Dates({
     date: req.params.date
  });

  Dates.addDate(newDate, (err, date) => {
    if (err) {
      res.json({succes:false, msg:"fail"});
    } else {
      res.json({succes: true, msg:"added"})
    }
  })
})

module.exports = router;
