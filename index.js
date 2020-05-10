import fileHelper from "./fileHelper/index";
import logger from './utils/logger';
import { exec } from 'child_process';
import outputVueCode from "./src/core.js";

/**
 * 根据指定文件读取
 * @param {*} filePath 
 */
const execute = function (filePath) {
  logger.start(` - Start execute file: ${filePath}\n`);
  const fileContent = fileHelper.read(filePath);
  fileHelper.write(outputVueCode(fileContent),
    function (error, fileName) {
      if (error)
        throw error
      else {
        setTimeout(() => {
          logger.success('The file has been saved! Path -> ' + fileName);
          exec(`prettier --write ${fileName}`);
        });
      }
    });
};

export default { execute };
