const parser = require("fast-xml-parser");
import convertToJson from "../utils/convertToJson";

export default function html2Json(htmlData) {
  const options = {
    ignoreAttributes: false,

    attributeNamePrefix: "",

    allowBooleanAttributes: true,

    parseAttributeValue: true,
    
    textNodeName:"__value__"
  };
  const tObj = parser.getTraversalObj(htmlData, options);
  const jsonObj = convertToJson(tObj, options);
  return jsonObj;
}
