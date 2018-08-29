var dbconfig = require('./dbconfig');

module.exports = {
  getDbConnStr: function () {
    var string = `mongodb://${dbconfig.username}:${dbconfig.password}@ds243728.mlab.com:43728/mean-scraper`;
    return string;
  },
  getScrapeEnableBool: function () {
    var boolean = (`${dbconfig.scrapeEnable}` === "true");
    return boolean;
  }
}