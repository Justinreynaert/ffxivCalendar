const express = require('express');
const router = express.Router();

const config = require('../config/database');

const Dates = require('../models/dates');

router.get('/', (req,res,next) => {
  res.json("test");
})

router.post('/addDate', (req,res,next) => {

  let newDate = new Dates({
     date: JSON.stringify(Date.now()),
     available: ["punchies"],
     tentative: ["baba"],
     unavailable: ["myrrh"]
  });

  Dates.addDate(newDate, (err, date) => {
    if (err) {
      res.json({succes:false, msg:"fail"});
    } else {
      res.json({succes: true, msg:"added"})
    }
  })
})

router.post("/setAvailability", (req,res) => {

  let date = {
    name: req.body.name,
    availability: req.body.availability,
    date: req.body.date
  }

  Dates.setAvailibility(date, (err,data) => {
    if (err) {
      res.json({succes:false});
    } else {
      res.json(data);
    }
  })

});


router.get('/getDates', (req, res, next) => {

  Dates.getAllDates(res);
});

module.exports = router;
