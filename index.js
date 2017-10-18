const express = require('express');
const app = express();

const port = 5000;

app.use(express.static(__dirname))

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || port, function() {
  console.log("App started on port 5000");
})
