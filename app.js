const mongoose = require('mongoose');
const config = require('./config');
const webScraper = require('./webScraper');

//Connect to Database
mongoose.connect(config.getDbConnStr(), {
  useNewUrlParser: true
});
//On successfully connected
mongoose.connection.on('connected', () => {
  console.log(`Connected to database : ${config.getDbConnStr()}`);
});
//On connection error
mongoose.connection.on('error', (err) => {
  console.log(`Error occurred while Database Connection : ${err}`);
});


webScraper();