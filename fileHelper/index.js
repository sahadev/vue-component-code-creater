const fileSystem = require("fs");
// const prettier = require("prettier");
const { exec } = require('child_process');
const logger = require('../utils/logger');

module.exports = {
  write: function (content) {
    // content = prettier.format(content, {
    //   vueIndentScriptAndStyle: true,
    // });
    const fileName = `./dist/template${new Date().getTime()}.vue`;
    fileSystem.writeFile(
      fileName,
      content,
      function (error) {
        if (error)
          throw error
        else {
          setTimeout(() => {
            logger.success('The file has been saved! Path -> ' + fileName);
            exec(`prettier --write ${fileName}`);
          });
        }
      }
    );
  },
};
