const file = require("fs");
const vueTemplate = require("./template/index");
const fileHelper = require("./fileHelper/index");
const logger = require('./utils/logger');

const execute = function (filePath) {
  logger.start(` - Start execute file: ${filePath}`);
  const fileContent = file.readFileSync(filePath);
  const jsonObj = JSON.parse(fileContent);
  parseJson(jsonObj);

  // 生成执行结果
  generateResult();
};

// 类定义放入其中
const classSet = new Set();
// 事件放入其中
const methodSet = new Set();
// 数据引用放入其中
const dataSet = new Set();

// 递归解析Json
function parseJson(json) {
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];
      if (value instanceof Array) {
        value.forEach((item) => parseJson(item));
      } else {
        deliveryResult(key, value);
      }
    }
  }
}

// 将所有需要替换的内容通过装饰器逐步替换
function replaceKeyInfo() {
  return replaceStyles(replaceMethods(getVueTemplate()));
}

// 从模板中替换方法
function replaceMethods(template) {
  return template.replace("// $eventMethods", convertMethods());
}

// 从木板中替换样式
function replaceStyles(template) {
  return template.replace("/** $stylesTemplate */", convertStyles());
}


// 合成方法集
function convertMethods() {
  const methodsStr = [...methodSet].map(generateFunction);
  return methodsStr.join(',\n');
}

// 合成style集
function convertStyles() {
  const classStr = [...classSet].map(generateClass);
  return classStr.join('\n');
}

// 分发解析结果
function deliveryResult(key, value) {
  switch (key) {
    case "click":
      methodSet.add(value);
      break;
    case "class":
      const classes = value.split(' ');
      classes.forEach(item => {
        // 处理多个空字符串
        if (!item) return;
        classSet.add(item);
      })
      break;
    default:
      break;
  }
}

// 生成一个方法
function generateFunction(functionName) {
  return `${functionName}(){}`;
}

// 生成一个class
function generateClass(className) {
  return `.${className}{}`;
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
