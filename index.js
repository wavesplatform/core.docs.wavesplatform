global.coreRootPath = __dirname;
global.documentationFilesMapName = 'documentation-files-map.json'
const getVuepressConfig = require('./.vuepress/config');
// const vuepressEnhanceApp = require('./.vuepress/enhanceApp');
const runServer = require('./server');
// const makePdfPages = require('./server/makePdfPages');
module.exports = {
  getVuepressConfig,
  // runVuepressEnhanceApp,
  runServer,
  // makePdfPages,
};
