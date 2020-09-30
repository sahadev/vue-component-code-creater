// 生成一个方法
function generateFunction(functionName) {
  return `${functionName}(){}`;
}

// 生成一个class
function generateClass(className) {
  return `.${className}{}`;
}

// 生成一个键值对
function generateData(dataName) {
  return `${dataName}:''`;
}

// 合成方法集
function convertMethods(set) {
  const methodsStr = [...set].map(generateFunction);
  return methodsStr.join(",\n");
}

// 合成style集
function convertStyles(set) {
  const classStr = [...set].map(generateClass);
  return classStr.join("\n");
}

// 合成data集
function convertDatas(set, options) {
  let dataStr = [...set].map(generateData);
  // 回调外部，使外部作用最后结果
  if (options.convertDataResult) {
    dataStr = options.convertDataResult(dataStr);
  }
  return dataStr.join(",\n");
}

// 从模板中替换方法
export function replaceMethods(template, set) {
  return template.replace("// $eventMethods", convertMethods(set));
}

// 从模板中替换样式
export function replaceStyles(template, set) {
  return template.replace("/** $stylesTemplate */", convertStyles(set));
}
// 从模板中替换样式
export function replaceDatas(template, set, options) {
  const defaultCode = convertDatas(set, options);
  return template.replace("// $datas", defaultCode);
}
