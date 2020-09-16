'use strict';

//This is core convert file

function isExist(v) {
  return typeof v !== "undefined";
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a
 */
function merge(target, a, arrayMode) {
  if (a) {
    const keys = Object.keys(a); // will return an array of own properties
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      if (arrayMode === "strict") {
        target[keys[i]] = [a[keys[i]]];
      } else {
        target[keys[i]] = a[keys[i]];
      }
    }
  }
}
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */

function getValue(v) {
  if (isExist(v)) {
    return v;
  } else {
    return "";
  }
}

// const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};

function buildOptions(options, defaultOptions, props) {
  var newOptions = {};
  if (!options) {
    return defaultOptions; //if there are not options
  }

  for (let i = 0; i < props.length; i++) {
    if (options[props[i]] !== undefined) {
      newOptions[props[i]] = options[props[i]];
    } else {
      newOptions[props[i]] = defaultOptions[props[i]];
    }
  }
  return newOptions;
}

var util = {
  buildOptions,
  getValue,
  merge,
  isEmptyObject,
  isExist,
};

function convertToJson(node, options) {
  const jObj = {};

  //when no child node or attr is present
  if (
    (!node.child || util.isEmptyObject(node.child)) &&
    (!node.attrsMap || util.isEmptyObject(node.attrsMap))
  ) {
    if (util.isExist(node.val)) {
      return {
        undefined: node.val,
      };
    } else return { undefined: "" };
  } else {
    //otherwise create a textnode if node has some text
    if (util.isExist(node.val)) {
      if (
        !(
          typeof node.val === "string" &&
          (node.val === "" || node.val === options.cdataPositionChar)
        )
      ) {
        if (options.arrayMode === "strict") {
          jObj[options.textNodeName] = [node.val];
        } else {
          jObj[options.textNodeName] = node.val;
        }
      }
    }
  }

  util.merge(jObj, node.attrsMap, options.arrayMode);

  const keys = Object.keys(node.child);
  for (let index = 0; index < keys.length; index++) {
    const tagname = keys[index];
    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj["__children"] = [];
      for (const tag in node.child[tagname]) {
        const newObj = {};
        newObj[tagname] = convertToJson(node.child[tagname][tag], options);
        jObj["__children"].push(newObj);
      }
    } else {
      if (options.arrayMode === true) {
        const result = convertToJson(node.child[tagname][0], options);
        if (typeof result === "object") jObj[tagname] = [result];
        else jObj[tagname] = result;
      } else if (options.arrayMode === "strict") {
        jObj[tagname] = [convertToJson(node.child[tagname][0], options)];
      } else {
        jObj[tagname] = convertToJson(node.child[tagname][0], options);
      }
    }
  }

  //add value
  return jObj;
}

const parser = require("fast-xml-parser");

function html2Json(htmlData) {
  const options = {
    ignoreAttributes: false,

    attributeNamePrefix: "",

    allowBooleanAttributes: true,

    parseAttributeValue: true,
  };
  const tObj = parser.getTraversalObj(htmlData, options);
  const jsonObj = convertToJson(tObj, options);
  return jsonObj;
}

module.exports = html2Json;
