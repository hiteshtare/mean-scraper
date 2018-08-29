const mongoose = require('mongoose');
const config = require('./config');
const webScraperModule = require('./webScraper');

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port 3000");
});

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
  console.log(`#Error occurred while making Database Connection : ${err}`);
});

webScraperModule();