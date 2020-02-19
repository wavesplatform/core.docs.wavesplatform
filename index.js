const inspector = require('inspector');
inspector.open(9229, '127.0.0.1');

global.coreRootPath = __dirname;
global.documentationFilesMapName = 'documentation-files-map.json';

global.defaultLocale = 'en-US';
global.ruLangKey = 'ru-RU';

const VueForServer = require('./utils/vueForServer');

const vuepress = require('./utils/vuepress/packages/vuepress');

// const vuepressEnhanceApp = require('./.vuepress/enhanceApp');
const runServer = require('./server');
// const makePdfPages = require('./server/makePdfPages');

const getVuepressConfig = require('./.vuepress/config');
// const vuepressConfig = require('./.vuepress/config');
const deepmerge = require('deepmerge');


global.vm = new VueForServer({
  methods: {
    configureWebpackOriginal(config, dirname) {
      console.log('config, dirname:', config, dirname);
      const configureWebpackOriginal = config.configureWebpack;
      config.configureWebpack = (webpackConfig, isServer) => {
        console.log('dirname:', dirname)
        webpackConfig.resolve.alias['@themeExtend'] = dirname;
        configureWebpackOriginal(webpackConfig, isServer);
      };
      return config;
    },
    mergeVuepressConfigs(vuepressConfig) {
      return deepmerge(getVuepressConfig, vuepressConfig, {
        arrayMerge: (destinationArray, sourceArray, options) => {
          return [...sourceArray, ...destinationArray];
        },
      });
    },
  },

  created() {
    this.VueForServer = VueForServer;
    this.getVuepressConfig = getVuepressConfig;
    this.runServer = runServer;
    this.vuepress = vuepress;
    // this.runVuepressEnhanceApp = runVuepressEnhanceApp;
    // this.makePdfPages = makePdfPages;

    console.log('vuepress:', vuepress);
  },
});

module.exports = global.vm;
// setInterval(() => {}, 10000);


