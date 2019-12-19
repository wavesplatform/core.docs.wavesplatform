const processEnv = process.env;
const envPort = processEnv.port;
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
const GetSearchResultByQuery = require('./getSearchResultByQuery');
const redirects = require('./redirects')

module.exports = async(vuepressDestPath, redirectList = []) => {
    const getSearchResultByQuery = await GetSearchResultByQuery(vuepressDestPath);

    if(!getSearchResultByQuery) {
        console.error('!getSearchResultByQuery');
    }

    app.use(async(ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        await next();
    });

    if(redirectList.length) {
        app.use(redirects(redirectList));
    }

    app.use(async (ctx, next) => {
        const searchQuery = ctx.query.search;
        if (ctx.req.url === '/') {
            ctx.redirect('/en/');
        } else if(searchQuery) {
            const searchResult = await getSearchResultByQuery(searchQuery);
            ctx.body = searchResult;
        } else {
            await next();
        }
    });

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

    // app.use(async (ctx, next) => {
    //     // req.url
    //     console.log('ctx:', ctx);
    //     ctx.request.url = ctx.request.url.replace('.html', '');
    //
    //     ctx.url = ctx.url.replace('.html', '123');
    //     await next();
    //
    // });

    app.listen(serverPort, '0.0.0.0');

    console.log(`listening on port ${serverPort}`)
}
