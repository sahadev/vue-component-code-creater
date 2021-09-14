import fileHelper from "./fileHelper/index.js";
import logger from './utils/logger.js';

import { CodeGenerator } from "./src/core.js";

/**
 * 根据指定文件读取
 * @param {*} filePath 
 */
export const execute = function (filePath) {
  logger.start(` - Start execute file: ${filePath}\n`);
  const fileContent = fileHelper.read(filePath);

  logger.success(new CodeGenerator().outputVueCode(fileContent));
};

