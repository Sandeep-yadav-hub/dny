const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var morgan = require('morgan')
const socket = require("socket.io");

const app = express();
var corsOptions = {
  origin: ["http://localhost:3000","http://192.168.1.102:3000"]
};
app.use(morgan('dev'))
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
const HTTPServer = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

module.exports = {app,HTTPServer}