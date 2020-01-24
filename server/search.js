const GetSearchResultByQuery = require('./getSearchResultByQuery');
module.exports = async (vuepressDestPath) => {
    const getSearchResultByQuery = await GetSearchResultByQuery(vuepressDestPath);
    if(!getSearchResultByQuery) {
        console.error('!getSearchResultByQuery');
    }
    return async (ctx, next) => {
        const searchQuery = ctx.query.search;
        const searchLocalePath = ctx.query.localePath;
        if(searchQuery) {
            const searchResult = await getSearchResultByQuery(searchQuery, searchLocalePath);
            ctx.body = searchResult;
            return;
        }
        await next();
    };
};
