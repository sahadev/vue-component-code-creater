"use strict";

const util = require("./utils2");

const convertToJson = function (node, options) {
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
};

module.exports = convertToJson;
