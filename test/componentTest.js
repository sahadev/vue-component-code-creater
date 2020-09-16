var parser = require('fast-xml-parser');
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
var jsonObj = parser.convertToJson(tObj, options);

delete jsonObj.script;
delete jsonObj.style;


console.info(JSON.stringify(jsonObj));