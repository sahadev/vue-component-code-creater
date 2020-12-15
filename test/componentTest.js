// var parser = require("fast-xml-parser");
const { html2Json } = require("../product/bundle-html2json-common");

const fs = require("fs");
const xmlData = fs.readFileSync("./test/test.vue", {
  encoding: "utf-8",
});

(async function exec() {
  const root = await html2Json(xmlData);
  const { outputVueCodeWithJsonObj } = require("../product/bundle-core-common");
  var xml = outputVueCodeWithJsonObj(root);
  console.info(xml);
})()



