const fileSystem = require("fs");
// const prettier = require("prettier");
const { exec } = require('child_process');

module.exports = {
  write: function (content) {
    // content = prettier.format(content, {
    //   vueIndentScriptAndStyle: true,
    // });
    const fileName = `./dist/template${new Date().getTime()}.vue`;
    fileSystem.writeFile(
      fileName,
      content,
      function (err) {
        console.info(`文件存储结果 -> ${err} `);
        exec(`prettier --write ${fileName}`);
      }
    );
  },
};
