"use strict";
const db = require("../../app/models");
const axios = require('axios');
var count = 1;
function increaseCount() {
    return count = count + 1;
}
if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
async function readFile() {
    var fs = require("fs");
    console.log("Reading File");
    // Check to see if tags are given
    var tags = [];
    if (process.argv.length > 3) {
        process.argv.forEach(function (line, index) {
            if (index > 3) {
                tags.push(line);
            }
        });
        tags.flat();
    }
    fs.readFileSync(process.argv[2]).toString().split("\n").forEach(function (line, index, arr) {
        if (index === arr.length - 1 && line === "") {
            return;
        }
        var strFirstTwo = line.substring(0, 2);
        if (strFirstTwo === "TI") {
            increaseCount();
            addArticlebyTitle(line.substring(6, line.count), tags.flat(2));
        }
    });
    return;
}
async function processArticles() {
    await readFile();
    console.log("second function time");
}
/**
 *
 * @param {String} title
 * @param {Array} tag
 */
async function addArticlebyTitle(title, ...tag) {
    console.log(tag[0]);
    axios
        .post('http://localhost:8080/api/articles', {
        title: title,
        tag: tag[0]
    })
        .catch(error => {
        console.error(error);
    });
}
readFile();
