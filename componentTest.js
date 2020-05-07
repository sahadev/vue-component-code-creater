var parser = require('fast-xml-parser');
var he = require('he'); const prettier = require("prettier");

var options = {
    ignoreAttributes: false,

    attributeNamePrefix: "",

    allowBooleanAttributes: true,

    parseAttributeValue: true,
};

const fs = require('fs');

const xmlData = fs.readFileSync('./GradeInfo.vue', {
    encoding: 'utf-8'
});

// Intermediate obj
var tObj = parser.getTraversalObj(xmlData, options);
var jsonObj = parser.convertToJson(tObj, options);

delete jsonObj.script;
delete jsonObj.style;


console.info(JSON.stringify(jsonObj));

var Parser = require("./utils/json2xml");

var defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: false, //default is false
    textNodeName : "#text",
    ignoreAttributes : false,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: true,
    indentBy: "  ",
    supressEmptyNode: false
};

var parser = new Parser(defaultOptions);
var xml = parser.parse(jsonObj);

console.info(xml);