
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
    return `${dataName}:null`;
}



// 合成方法集
function convertMethods(set) {
    const methodsStr = [...set].map(generateFunction);
    return methodsStr.join(',\n');
}

// 合成style集
function convertStyles(set) {
    const classStr = [...set].map(generateClass);
    return classStr.join('\n');
}

// 合成data集
function convertDatas(set) {
    const dataStr = [...set].map(generateData);
    return dataStr.join(',\n');
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
export function replaceDatas(template, set) {
    return template.replace("// $datas", convertDatas(set));
}
