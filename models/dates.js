const mongoose = require('mongoose');
const config = require('../config/database');

//Schema

const DatesSchema = mongoose.Schema({
  date: {
    type: String
  },
  available: [{
    type: String
  }],
  unavailable: [{
    type: String
  }],
  tentative: [{
    type: String
  }],
  versionKey: false
});

const Dates = module.exports = mongoose.model('Dates', DatesSchema);

module.exports.getDateById = (id, callback) => {
  Dates.findById(id, callback);
}

module.exports.addDate = (newDate, callback) => {
  newDate.save(callback);
}

module.exports.getAllDates = function(res) {
  Dates.find((err, dates) => {
    if (!err) {
      res.json(dates)
    } else {
      console.log(err)
    }
  });
}

module.exports.findByDate = (date, callback) => {
  Dates.findOne({
    'date': date.date
  }, callback);
}

module.exports.setAvailibility = function(date, callback) {
  /* This code is ugry --- need fixerino */

  Dates.findByDate(date, function(err, data) {


    let existing = hasMatch(data, date.name);

    switch (date.availability) {
      case "0":
        //available
        // check if user is already anywhere --
        if (existing !== undefined) {
          console.log(existing);
          //delete first
          data[existing.array].splice(existing.i,1);
        }
        console.log(date.name + " is available - updating");
        data.available.push(date.name);
        data.save();
        break;

      case "1":
        //unavailable
        // check if user is already anywhere --
        if (existing !== undefined) {
          console.log(existing);
          //delete first
          data[existing.array].splice(existing.i,1);
        }
        console.log(date.name + " is unavailable - updating");
        data.unavailable.push(date.name);
        data.save();
        break;

      case "2":
        //tentative
        // check if user is already anywhere --
        if (existing !== undefined) {
          console.log(existing);
          //delete first
          data[existing.array].splice(existing.i,1);
        }
        console.log(date.name + " is tentative - updating");
        data.tentative.push(date.name);
        data.save();
        break;
    }
    
    callback(err, data);
  });
}

function hasMatch(JsonData, checkVal) {
  // check available
  for (let i = 0; i < JsonData.available.length; i++) {
    if (checkVal == JsonData.available[i]) {
      return {"i":i,"array":"available"};
    }
  }

  // check tentative
  for (let i = 0; i < JsonData.tentative.length; i++) {
    if (checkVal == JsonData.tentative[i]) {
        return {"i":i,"array":"tentative"};;
    }
  }

  //check unavailable
  for (let i = 0; i < JsonData.unavailable.length; i++) {
    if (checkVal == JsonData.unavailable[i]) {
        return {"i":i,"array":"unavailable"};;
    }
  }
}
