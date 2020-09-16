var parser = require('fast-xml-parser');
const convertToJson = require('../utils/convertToJson');
const prettier = require("prettier");

var options = {
    ignoreAttributes: false,

    attributeNamePrefix: "",

    allowBooleanAttributes: true,

    parseAttributeValue: true,
};

const fs = require('fs');

const xmlData = fs.readFileSync('./test/test.vue', {
    encoding: 'utf-8'
});

// Intermediate obj
var tObj = parser.getTraversalObj(xmlData, options);
debugger
var jsonObj = convertToJson(tObj, options);

delete jsonObj.script;
delete jsonObj.style;

console.info(JSON.stringify(jsonObj));