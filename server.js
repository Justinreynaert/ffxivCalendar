const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const config = require('./config/database');

const app = express();


const port = 5000;

mongoose.connect(process.env.database || config.database);

mongoose.connection.on('connected', () => {
  console.log('Connected to db ', process.env.database || config.database);
})

const dates = require('./routes/dates');
const users = require('./routes/users');

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(express.static(path.join(__dirname)));
//routes
app.use('/dates',dates);
app.use('/users',users);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(process.env.PORT || port, function() {
  console.log("App started on port 5000");
})
