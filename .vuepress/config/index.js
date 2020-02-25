const processEnv = process.env;
const envPort = processEnv.port || 3083;
const envHost = processEnv.host || '0.0.0.0';
// const envMakePdf = processEnv.makePdf;
const path = require('path');
const packageName = require(path.join(global.coreRootPath, 'package.json')).name;
const corePath = processEnv.corePath || packageName;
const fs = require('fs');
const webpack = require('webpack');
const deepmerge = require('deepmerge');
// const markdownConfig = require('./markdownConfig');
const cleanUrlsPlugin = require('vuepress-plugin-clean-urls');

// const ignoreNotIndexedFilesPlugin = require('./plugins/ignoreNotIndexedFiles');
// const beforeDevServer = require('./beforeDevServer/');

// module.exports = (ctx, mixin) => {
//     const rootConfig = deepmerge({
//         // beforeDevServer: beforeDevServer(ctx),
//         serviceWorker: false,
//         host: envHost,
//         port: envPort,
//         // markdown: markdownConfig(ctx),
//         head: [
//             // ['link', { rel: 'icon', href: `/favicon-32x32.png` }],
//             ['link', { rel: 'manifest', href: '/manifest.json' }],
//             ['meta', {
//                 name: 'viewport',
//                 content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
//             }],
//             ['meta', { name: 'theme-color', content: '#1f5af6' }],
//             ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
//             ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
//             ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
//         ],
//         temp: path.join(__dirname, '../.temp'),
//         theme: path.join(__dirname, '../'),
//         themeConfig: {
//             buildDate: new Date(),
//             activeColouration: 'default',
//             isShowEditLink: true,
//             colouration: [
//
//             ],
//             env: {
//                 adminServerUrl: process.env.adminServerUrl
//             },
//             docsDir: 'docs',
//             gtmId: '',
//             defaultDocsVersionName: '',
//             defaultLanguage: '',
//         },
//         plugins: [
//             cleanUrlsPlugin,
//             // [
//             //     cleanUrlsPlugin,
//             //     {
//             //         normalSuffix: '',
//             //         indexSuffix: '',
//             //         notFoundPath: '/404.html',
//             //     },
//             // ],
//             // [
//             //     'vuepress-plugin-container',
//             //     {
//             //         type: 'tip',
//             //         defaultTitle: {
//             //             '/': 'TIP',
//             //             '/zh/': '提示',
//             //         },
//             //     },
//             // ],
//             // ['pwa', {
//             //     serviceWorker: true,
//             //     updatePopup: true
//             // }],
//         ],
//         extraWatchFiles: [
//             // '.vuepress/locales/**',
//         ],
//
//         configureWebpack(config, isServer) {
//             // console.log('config:', config);
//             // config.module
//             //   .rule('js') // Find the rule.
//             //   .use('babel-loader') // Find the loader
//             //   .tap(options => {
//             //       // Object.assign(options, { // Modifying options
//             //       //     plugins: [
//             //       //         ["import", {
//             //       //             "libraryName": "ant-design-vue",
//             //       //             "libraryDirectory": "es",
//             //       //             "style": "css"
//             //       //         }]
//             //       //     ]
//             //       // })
//             //       console.log('options:', options);
//             //       return options;
//             //   });
//
//
//             config.resolve.alias[packageName] = corePath;
//
//             if (!isServer && process.argv.includes('build')) {
//                 config.plugins.push(
//                   {
//                       apply(compiler) {
//                           const vuepressDestPath = rootConfig.dest;
//                           compiler.hooks.done.tap('compilationDone', (compilation) => {
//                               const pagePaths = [];
//                               const pageListJson = JSON.stringify(
//                                 ctx.pages.map(page => {
//                                     const pagePath = page.path;
//                                     pagePaths.push(pagePath);
//                                     return {
//                                         title: page.title,
//                                         path: pagePath,
//                                         localePath: page._localePath,
//                                     };
//                                 })
//                               );
//                               fs.writeFileSync(`${vuepressDestPath}/${global.documentationFilesMapName}`, pageListJson, 'utf8', /*() => {
//                                   console.log('documentation-files-map.json done');
//                               }*/);
//                               console.log(`${global.documentationFilesMapName} done`);
//                           });
//                       }
//                   },
//
//                   new webpack.EnvironmentPlugin({
//                       isDev: process.env.isDev,
//                   }),
//
//                 );
//             }
//         },
//         // chainWebpack: (config, isServer) => {},
//     }, mixin, {
//         arrayMerge: (destinationArray, sourceArray, options) => {
//             return [...sourceArray, ...destinationArray];
//         },
//     });
//     return rootConfig;
// };



module.exports = {
    // beforeDevServer: beforeDevServer(ctx),
    serviceWorker: false,
    host: envHost,
    port: envPort,
    // markdown: markdownConfig(ctx),
    head: [
        // ['link', { rel: 'icon', href: `/favicon-32x32.png` }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['meta', {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
        }],
        ['meta', { name: 'theme-color', content: '#1f5af6' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
    ],
    temp: path.join(__dirname, '../.temp'),
    theme: path.join(__dirname, '../'),
    themeConfig: {
        buildDate: new Date(),
        activeColouration: 'default',
        isShowEditLink: true,
        colouration: [

        ],
        env: {
            adminServerUrl: process.env.adminServerUrl
        },
        docsDir: 'docs',
        gtmId: '',
        defaultDocsVersionName: '',
        defaultLanguage: '',
    },
    plugins: [
        cleanUrlsPlugin,
        // [
        //     cleanUrlsPlugin,
        //     {
        //         normalSuffix: '',
        //         indexSuffix: '',
        //         notFoundPath: '/404.html',
        //     },
        // ],
        // [
        //     'vuepress-plugin-container',
        //     {
        //         type: 'tip',
        //         defaultTitle: {
        //             '/': 'TIP',
        //             '/zh/': '提示',
        //         },
        //     },
        // ],
        // ['pwa', {
        //     serviceWorker: true,
        //     updatePopup: true
        // }],
    ],
    extraWatchFiles: [
        // '.vuepress/locales/**',
    ],

    configureWebpack(config, isServer) {
        console.log('dirname:', dirname)
        // config.resolve.alias['@themeExtend'] = dirname;
        // console.log('config:', config);
        // config.module
        //   .rule('js') // Find the rule.
        //   .use('babel-loader') // Find the loader
        //   .tap(options => {
        //       // Object.assign(options, { // Modifying options
        //       //     plugins: [
        //       //         ["import", {
        //       //             "libraryName": "ant-design-vue",
        //       //             "libraryDirectory": "es",
        //       //             "style": "css"
        //       //         }]
        //       //     ]
        //       // })
        //       console.log('options:', options);
        //       return options;
        //   });


        config.resolve.alias[packageName] = corePath;

        if (!isServer && process.argv.includes('build')) {
            config.plugins.push(
              {
                  apply(compiler) {
                      const vuepressDestPath = rootConfig.dest;
                      compiler.hooks.done.tap('compilationDone', (compilation) => {
                          const pagePaths = [];
                          const pageListJson = JSON.stringify(
                            ctx.pages.map(page => {
                                const pagePath = page.path;
                                pagePaths.push(pagePath);
                                return {
                                    title: page.title,
                                    path: pagePath,
                                    localePath: page._localePath,
                                };
                            })
                          );
                          fs.writeFileSync(`${vuepressDestPath}/${global.documentationFilesMapName}`, pageListJson, 'utf8', /*() => {
                                  console.log('documentation-files-map.json done');
                              }*/);
                          console.log(`${global.documentationFilesMapName} done`);
                      });
                  }
              },

              new webpack.EnvironmentPlugin({
                  isDev: process.env.isDev,
              }),

            );
        }
    },
    // chainWebpack: (config, isServer) => {},
};
