const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config/database');

const app = express();


const port = 5000;

mongoose.connect(/*process.env.database || */config.database);

mongoose.connection.on('connected', () => {
  console.log('Connected to db ' + config.database);
})

const dates = require('./routes/dates');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(express.static(__dirname))
//routes
app.use('/dates',dates);





app.get('*', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || port, function() {
  console.log("App started on port 5000");
})
