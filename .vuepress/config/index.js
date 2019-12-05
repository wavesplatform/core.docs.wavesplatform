const processEnv = process.env;
const envPort = processEnv.port || 3083;
const envHost = processEnv.host || '0.0.0.0';
const path = require('path');
const packageName = require(path.join(__dirname, '../../package.json')).name;
const corePath = processEnv.corePath || packageName;
const fs = require('fs');
const webpack = require('webpack');
const deepmerge = require('deepmerge');
const cleanUrlsPlugin = require('vuepress-plugin-clean-urls');
// const beforeDevServer = require('./beforeDevServer/');

module.exports = (ctx, mixin) => {
    const rootConfig = deepmerge({
        // beforeDevServer: beforeDevServer(ctx),
        serviceWorker: false,
        host: envHost,
        port: envPort,
        temp: path.join(__dirname, '../.temp'),
        head: [
            ['link', { rel: 'icon', href: `/favicon-32x32.png` }],
            ['link', { rel: 'manifest', href: '/manifest.json' }],
            ['meta', {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
            }],
            ['meta', { name: 'theme-color', content: '#1f5af6' }],
            ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
            ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
            ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
            ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#1f5af6' }],
            ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
            ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
        ],
        theme: path.join(__dirname, '../'),
        themeConfig: {
            buildDate: new Date(),
            activeColouration: 'default',
            env: {
                adminServerUrl: process.env.adminServerUrl
            },
            logo: '/waves-docs-logo.svg',
            docsDir: 'docs',
            repo: 'https://github.com/wavesplatform/docs.wavesplatform',
        },
        plugins: [
            cleanUrlsPlugin,
            // ['pwa', {
            //     serviceWorker: true,
            //     updatePopup: true
            // }],
            // ['google-analytics', {
            //     ga: 'UA-128189152-1'
            // }],
            // [
            //     'vuepress-plugin-clean-urls',
            //     {
            //         normalSuffix: '',
            //         indexSuffix: '',
            //         notFoundPath: '/404.html',
            //     },
            // ],
        ],
        extraWatchFiles: [
            // '.vuepress/locales/**',
        ],
        configureWebpack(config, isServer) {
            if (!isServer) {
                config.resolve.alias[packageName] = corePath;
                config.plugins.push({
                    apply: (compiler) => {
                        compiler.hooks.done.tap('compilationDone', (compilation) => {
                            const pageListJson = JSON.stringify(
                              ctx.pages.map(page => {
                                  return {
                                      title: page.title,
                                      path: page.path,
                                      localePath: page._localePath,
                                  };
                              })
                            );
                            fs.writeFile(`${rootConfig.dest}/documentation-files-map.json`, pageListJson, 'utf8', () => {
                                console.log('documentation-files-map.json done');
                            });

                        });
                    }
                });
                config.plugins.push(
                  new webpack.EnvironmentPlugin({
                      isDev: process.env.isDev,
                  })
                );
            }
        },
        // chainWebpack: (config, isServer) => {
        //     // console.log('chainWebpack config:', config, isServer)
        // },
    }, mixin);
    return rootConfig;
};
