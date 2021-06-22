const request = require("request");
const cheerio = require("cheerio");
const scorelink = require('./scorecard');
function getallmatchlink(url) {
    request(url, cb);
    function cb(err, response, url) {
        if (err) {
            console.log(error);
        } else {
            getextracthtml2(url);
        }
    }
}

function getextracthtml2(url) {
    let $ = cheerio.load(url);
    let scorecardlink = $("a[data-hover='Scorecard']");
    for (let i = 0; i < scorecardlink.length; i++) {
        let getatr = $(scorecardlink[i]).attr("href");
        let link = "https://www.espncricinfo.com" + getatr;
        console.log(link);
        scorelink.ps(link);
    }
}
module.exports = {
    getalmatch: getallmatchlink
}