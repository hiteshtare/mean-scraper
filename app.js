//Node Modules
const mongoose = require('mongoose');
const config = require('./config');
const express = require('express');

//Custom Modules
const webScraperModule = require('./webScraper');

//Initialize express app
var app = express();

//Assign Port No
var port = process.env.PORT || 3000;

//Respond with "Node Scrapper!" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send(JSON.stringify({
    'Node': 'Scrapper!'
  }));
});

//Start express server on specified port
app.listen(port, function () {
  console.log(`Server is running on port no: ${port}`);
});

//Connect to Database
mongoose.connect(config.getDbConnStr(), {
  useNewUrlParser: true
});
//On successfully connected
mongoose.connection.on('connected', () => {
  console.log(`Connected to database : ${config.getDbConnStr()}`);

  //Fetch scrapeEnable flag from config
  let isScrape = config.getScrapeEnableBool();

  console.log(`Scraping Enabled : ${isScrape}`);
  //Check for scrapeEnable flag
  if (isScrape) {
    //Run the scrapeNow function
    webScraperModule();
  }
});
//On connection error
mongoose.connection.on('error', (err) => {
  console.log(`#Error occurred while making Database Connection : ${err}`);
});