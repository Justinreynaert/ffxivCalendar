const mongoose = require('mongoose');
const config = require('../config/database');

//Schema

const DatesSchema = mongoose.Schema({
  date: {
    type: String,
    available: [{ name:String}],
    unavailable: [{ name:String}],
    tentative: [{ name:String}]
  },

  versionKey:false
});

const Dates = module.exports = mongoose.model('Dates', DatesSchema);



module.exports.getDateById = (id, callback) => {
  Dates.findById(id, callback);
}

module.exports.addDate = (newDate, callback) => {
  newDate.save(callback);
}

module.exports.getAllDates = function(res){
  Dates.find((err, dates) => {
    if(!err) {
      res.json(dates)
    } else {
      console.log(err)
    }
  });
}

module.exports.findByDate = (date, callback) => {
  Dates.findOne({'date': date.date}, callback);
}

module.exports.setAvailibility = function(date, callback) {

    Dates.findByDate(date, function(err, data, date) {

        let origData = data;
        console.log(date);

        switch(data.availability) {
          case 0:
            //available
            console.log(data.name + " is available - updating")
            break;

          case 1:
            //unavailable
            console.log(data.name + " is unavailable - updating")
            break;

          case 2:
            //tentative
            console.log(data.name + " is tentative - updating")
            break;
        }
    });

    Dates.findByDate(date, callback);
}
