// var parser = require("fast-xml-parser");
const convertToJson = require("../product/bundle-html2json-cjs");

const fs = require("fs");
const xmlData = fs.readFileSync("./test/test.vue", {
  encoding: "utf-8",
});

const htmlparser2 = require("htmlparser2");

function getNodeContent(node) {
  if(!node) {
    debugger
  }
  return node[Object.keys(node)[0]];
}


// 根节点
const root = {
  root: {
    __children: []
  }
};
// 当前访问的节点
let currentAccessObject = root;
// 之前访问的节点数组
let lastAccessStack = [root];

const parser = new htmlparser2.Parser({
  onopentag(tagname, attributes) {
    console.info(`on open tag name: ${tagname}`)

    // 每个节点的表示方法为:
    // {
    //   tagname: {
    //     key1: value1,
    //     key2: value2,
    //     __children: [
    //       {

    //       }
    //     ]
    //   }
    // }

    // 构建新节点
    const newNode = {};
    newNode[tagname] = attributes;
    attributes.__children = [];

    lastAccessStack.push(newNode);
    getNodeContent(currentAccessObject).__children.push(newNode);

    currentAccessObject = newNode;
  },
  ontext(text) {
    /*
     * Fires whenever a section of text was processed.
     *
     * Note that this can fire at any point within text and you might
     * have to stich together multiple pieces.
     */
    if (text.trim()) {
      console.log("-->", text);
      getNodeContent(currentAccessObject).__text__ = text;
    }
  },
  onclosetag(tagname) {
    /*
     * Fires when a tag is closed.
     *
     * You can rely on this event only firing when you have received an
     * equivalent opening tag before. Closing tags without corresponding
     * opening tags will be ignored.
     */
    console.info(`on close tag name: ${tagname}`)
    lastAccessStack.pop();

    currentAccessObject = lastAccessStack[lastAccessStack.length - 1];

    if (lastAccessStack.length === 1) {
      console.info(JSON.stringify(root));

      const { outputVueCodeWithJsonObj } = require("../product/bundle-core-cjs");

      var xml = outputVueCodeWithJsonObj(root);

      console.info(xml);
    }
  },
});
parser.write(
  xmlData
);
parser.end();
