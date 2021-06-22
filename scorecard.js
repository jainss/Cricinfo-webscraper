//const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const xlsx = require("xlsx");
function getscorecardlink(url) {
    request(url, cb);
}

function cb(error, response, html) {
    if (error) {
        console.log(error);
    } else {
        extractcontent(html);
    }
}
function extractcontent(html) {
    let $ = cheerio.load(html);
    let result = $('.event .status-text').text();
    let dateplacearr = $('.event .description').text().split(',');
    let Venue = dateplacearr[2].trim();
    let date = dateplacearr[1].trim();

    let innings = $('.card.content-block.match-scorecard-table>.Collapsible');
    // let htmlinning = "";
    for (let i = 0; i < innings.length; i++) {
        let teamnamearr = $(innings[i]).find("h5").text();
        teamnamearr = teamnamearr.split("INNINGS")[0].trim();
        let opponentindex = (i == 0) ? 1 : 0;
        let opponentnamearr = $(innings[opponentindex]).find("h5").text();
        opponentnamearr = opponentnamearr.split("INNINGS")[0].trim();
        console.log(`${date} ${Venue} ${teamnamearr} VS ${opponentnamearr} And ${result}`);
        let allrow = $(innings[i]).find('.table.batsman tbody tr');
        for (let j = 0; j < allrow.length; j++) {
            let allcols = $(allrow[j]).find("td");
            let isworthy = $(allcols[0]).hasClass("batsman-cell");
            if (isworthy == true) {
                let playername = $(allcols[0]).text().trim();
                let run = $(allcols[2]).text().trim();
                let balls = $(allcols[3]).text().trim();
                let fours = $(allcols[5]).text().trim();
                let sixs = $(allcols[6]).text().trim();
                let sr = $(allcols[7]).text().trim();
                console.log(`${playername} ${run} ${balls} ${fours} ${sixs} ${sr}`);
                processplayer(teamnamearr, playername, run, balls, fours, sixs, sr, opponentnamearr, Venue, date, result)
            }
        }
    }
}


function processplayer(teamname, playername, run, balls, fours, sixs, sr, opponent, Venue, date, result) {
    let teampath = path.join(__dirname, "IPL", teamname);
    dircreate(teampath);
    let filepath = path.join(teampath, playername + ".xlsx");
    let contentofplayer = excelreader(filepath, playername);
    let playerobj = {
        teamname,
        playername,
        run,
        balls,
        fours,
        sixs,
        sr,
        opponent,
        Venue,
        date,
        result
    }
    contentofplayer.push(playerobj);
    excelwriter(filepath, contentofplayer, playername);
}


function dircreate(filepath) {
    if (fs.existsSync(filepath) == false) {
        fs.mkdirSync(filepath);
    }
}
function excelwriter(pathlink, json, sheetname) {
    // // make a new workbook 
    let newWb = xlsx.utils.book_new(pathlink, json, sheetname);
    // // make a new sheet 
    let newWs = xlsx.utils.json_to_sheet(json);
    // // now append the sheet 
    xlsx.utils.book_append_sheet(newWb, newWs, sheetname);
    // //file path 
    xlsx.writeFile(newWb, pathlink);
}

function excelreader(pathlink, sheetname) {
    if (fs.existsSync(pathlink) == false) {
        return [];
    }
    // // read the xlsx file
    // // This is for workbook read 
    let wb = xlsx.readFile(pathlink);
    // // this is for sheet 
    let exceldata = wb.Sheets[sheetname];
    // // after get the sheet data
    let ans = xlsx.utils.sheet_to_json(exceldata);
    // //print or return 
    return ans;
}

module.exports = {
    ps: getscorecardlink
}