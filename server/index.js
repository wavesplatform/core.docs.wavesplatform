const processEnv = process.env;
const envPort = processEnv.port;
const envHost = processEnv.host || '0.0.0.0';
const envIsDev = processEnv.isDev;
const serverPort = envPort ? envPort :
    envIsDev ? 3000 : 3083
;
if(envIsDev) {
    const inspector = require('inspector');
    inspector.open(9229, '127.0.0.1');
}
const path = require('path');
const Koa = require('koa');
console.log('global.coreRootPath:', global.coreRootPath)
const serve = require(path.join(global.coreRootPath, 'utils/koa-static'));
const app = new Koa();
const redirects = require('./redirects');
const toLocale = require('./toLocale');
const cookies = require('./cookies');

module.exports = async(vuepressDestPath, redirectList = []) => {
    app.use(async(ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        await next();
    });

    if(redirectList.length) {
        app.use(redirects(redirectList));
    }

    app.use(cookies());

    app.use(
      await toLocale(vuepressDestPath)
    );

    app.use(
        serve(
            vuepressDestPath, {
                gzip: true,
                br: true,
                extensions: ['html'/*, 'pdf'*/],
                setHeaders(res, path, stats) {
                    // console.log('res, path, stats:', res, path, stats);
                },
            }
        )
    );

    app.listen(serverPort, /*'0.0.0.0'*/envHost);

    console.log(`listening on port ${serverPort}`)
}
