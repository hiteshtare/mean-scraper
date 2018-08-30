const puppeteer = require('puppeteer');
const constants = require('./util/constant');
const Candidate = require('./models/candidateModel');

function scrapeNow() {

  //Scraper function
  async function runScraper() {
    //Launch the headless Chrome browser with specified options

    console.log(`Launching browser.. B-)`);
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log(`Scraping! has started..`);

    //Open new page tab in the browser
    const page = await browser.newPage();

    //Check for unhandledRejection error
    process.on("unhandledRejection", (reason, p) => {
      console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
      browser.close();
    });

    //Navigate to our site
    await page.goto(constants.WEB_SITE_URI);
    //Select 'MUNICIPAL CORPORATION' as LocalBody
    await page.select(constants.LOCAL_BODY_DRPDWN, '5');
    await page.waitFor(1000);
    //Select 'Konkan' as Division
    await page.select(constants.DIVISION_DRPDWN, '6');
    await page.waitFor(1000)
    //Select 'Mumbai City' as District
    await page.select(constants.DISTRICT_DRPDWN, '519');
    await page.waitFor(1000);
    //Select 'BruhanMumbai Mahanagar Palika | MP' as Municipal Corporation Name
    await page.select(constants.MUNICIPAL_CORP_DRPDWN, '429');
    await page.waitFor(1000);
    //Select 'BruhanMumbai Mahanagar Palika' as Election Programe Name
    await page.select(constants.ELECTION_PROG_DRPDWN, '20');
    await page.waitFor(1000);
    //Select '1' as Ward
    await page.select(constants.WARD_DRPDWN, '3542');
    //Finally click on Search button 
    await page.click(constants.SEARCH_BTN);
    //Wait for results to load in datatable
    await page.waitFor(3000);

    //Declare empty array 'arrayCandidateResults'
    arrayCandidateResults = [];

    //Calculate number of rows in the data container
    let candidateListLength = await page.evaluate((sel) => {
      let candidateListSelectorID = document.getElementById(sel);
      let candidateSelectorTagName = candidateListSelectorID.getElementsByTagName('tr');
      return candidateSelectorTagName.length;
    }, constants.CANDIDATE_DATA_CONTAINER);

    //Iterate over those rows excluding 1st 2 rows as it contains header info
    for (let i = 2; i <= candidateListLength; i++) {
      let candidateSelector = constants.CANDIDATE_DATA_SELECTOR.replace("INDEX", i);

      let candidateListing = await page.evaluate((sel) => {
        //To fetch innerText inside a row
        return document.querySelector(sel).innerText;
      }, candidateSelector);

      //Push innerText 'candidateListing' into arrayCandidateResults
      arrayCandidateResults.push(candidateListing);
    }

    //Close the browser
    browser.close();

    return arrayCandidateResults;
  }

  //After successfull scraping
  runScraper().then((values) => {
    //Assign array values having scraped data
    let arrCandidates = values;
    var candidatesAdded = 0;

    //Remove all candidates added previously from mongo
    Candidate.deleteAllCandidates(function (err, callback) {
      //If error occurs while deleting
      if (err) {
        console.log(`Unable to delete All Candidates!`);
      } else {
        console.log(`All Candidates deleted successfully.`);
      }
    });

    //Iterate over arrCandidates
    arrCandidates.forEach((candidate) => {
      //Split string 'candidate' using '\t'
      let myCandidate = candidate.split('\t');

      //Create newCandidate Model
      let newCandidate = new Candidate({
        sr_no: myCandidate[0],
        registration_no: myCandidate[1],
        full_name: myCandidate[2]
      })

      //Add a candidate to mongo
      Candidate.addCandidate(newCandidate, function (err, callback) {
        //Log string 'myCandidate'
        console.log(myCandidate);
        //If error occurs while adding
        if (err) {
          console.log(`Unable to add Candidate!`);
        } else {
          candidatesAdded++;
          console.log(`Candidate added successfully.`);

          if (candidatesAdded === arrCandidates.length) {
            console.log(`>> Finished adding all Candidates successfully :)`);
          }
        }
      });

    });

  });
}

//Export the scrapeNow function as a module
module.exports = scrapeNow;