var parser = require("fast-xml-parser");
const convertToJson = require("../product/bundle-html2json-cjs");
const prettier = require("prettier");

var options = {
  ignoreAttributes: false,

  attributeNamePrefix: "",

  allowBooleanAttributes: true,

  parseAttributeValue: true,
};

const fs = require("fs");

const xmlData = fs.readFileSync("./test/test.vue", {
  encoding: "utf-8",
});

// Intermediate obj
var jsonObj = convertToJson(xmlData);
jsonObj = jsonObj.__children[0];

delete jsonObj.script;
delete jsonObj.style;

console.info(JSON.stringify(jsonObj));

const { outputVueCode } = require("../product/bundle-core-cjs");

var xml = outputVueCode(JSON.stringify(jsonObj));

console.info(xml);
