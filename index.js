const file = require("fs");
const vueTemplate = require("./template/index");
const fileHelper = require("./fileHelper/index");
const logger = require('./utils/logger');
const { replaceDatas, replaceMethods, replaceStyles } = require('./src/replace');

// 类定义放入其中
let classSet = new Set();
// 事件放入其中
let methodSet = new Set();
// 数据引用放入其中
let dataSet = new Set();
const rawAdd = Set.prototype.add;
Set.prototype.add = function (value) {
  if (typeof value === "string" && checkKeyword(value))
    rawAdd.apply(this, arguments);
}
// 解析后的Json对象
let jsonObj = null;

function checkKeyword(value) {
  return value != 'true' && value != 'false';
}

const execute = function (filePath) {
  logger.start(` - Start execute file: ${filePath}\n`);
  const fileContent = file.readFileSync(filePath);
  jsonObj = JSON.parse(fileContent);
  parseJson(jsonObj);

  // 对集合进行排序
  dataSet = sort(dataSet);
  methodSet = sort(methodSet);
  classSet = sort(classSet);

  // 生成执行结果
  generateResult();
};

function sort(set) {
  return new Set(Array.from(set).sort());
}


// 递归解析Json
function parseJson(json) {
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];
      if (value instanceof Array) {
        value.forEach((item) => parseJson(item));
      } else if (value instanceof Object) {
        parseJson(value);
      } else {
        deliveryResult(key, value);
      }
    }
  }
}

// 将所有需要替换的内容通过装饰器逐步替换
function replaceKeyInfo() {
  return replaceStyles(replaceDatas(replaceMethods(replaceHtmlTemplate(getVueTemplate()), methodSet), dataSet), classSet);
}

function replaceHtmlTemplate(template) {
  const Parser = require("./utils/json2xml");

  const defaultOptions = {
    attributeNamePrefix: "@_",
    attrNodeName: false, //default is false
    textNodeName: "#text",
    ignoreAttributes: false,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: true,
    indentBy: "  ",
    supressEmptyNode: false
  };

  const parser = new Parser(defaultOptions);
  const xml = parser.parse(jsonObj.template);

  return template.replace("<!--在此自动生成-->", xml);
}



// 分发解析结果
function deliveryResult(key, value) {
  if (key === "class") {
    const classes = value.split(' ');
    classes.forEach(item => {
      // 处理多个空字符串
      if (!item) return;
      classSet.add(item);
    })
  } else if ((/^v-on/g.test(key) || /^@/g.test(key))) { // 匹配@,v-on
    let expresionArray = null;
    if (checkIsVar(value)) {
      methodSet.add(value);
    } else if ((expresionArray = findVarFormExpression(value)).length > 0) {
      // 如果是表达式的话，则一定代表是变量参与了运算
      expresionArray.forEach(element => {
        dataSet.add(element);
      });
    }
    // TODO 支持自定义传参情况：handleJump(scope.row.id, scope.row.name)
  } else if (/^v-/g.test(key) || /^:+/g.test(key)) {// 匹配v-,:(v-bind)
    let expresionArray = null;
    if (checkIsVar(value)) {
      dataSet.add(value);
    } else if ((expresionArray = findVarFormExpression(value)).length > 0) {
      expresionArray.forEach(element => {
        dataSet.add(element);
      });
    }
  } else if (key === "undefined") { // 匹配v-text,{{}}
    if (/[{]{2}.+[}]{2}/g.test(value)) {
      // 用于匹配v-text {{}}
      const temp = findVarFormExpression(value);
      temp.forEach(element => {
        dataSet.add(element);
      });
    }
  } else { // 对于不支持的，以日志输出，方便排查
    console.info(`key: ${key}, value: ${value}`);
  }
}

/**
 * 检查这个值是不是符合一个变量的规则, 这里情况特殊，不可以以大写字母开头，以驼峰命名为准
 * @param {*} value 
 */
function checkIsVar(value) {
  return /^[_a-z]{1}[_0-9a-zA-Z]*$/g.test(value);
}

/**
 * 从表达式中提取变量，这里情况特殊，不可以以大写字母开头，以驼峰命名为准
 * @param {*} expression 
 */
function findVarFormExpression(expression) {
  if (typeof expression === "string") {
    let temp = expression.match(/[_a-z]{1}[_0-9a-zA-Z]*/g);
    if (!temp) {
      temp = [];
    }
    return temp;
  }
  else {
    return []
  };
}

function generateResult() {
  // 需要输出的结果有：
  // 1.html template
  // 1) 支持解析v-model/@click/
  // 2.script template
  fileHelper.write(replaceKeyInfo());
  // 3.style template
}

function getVueTemplate() {
  return vueTemplate();
}

module.exports = execute;
