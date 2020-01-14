const GetSearchResultByQuery = require('./getSearchResultByQuery');
const ruLangKey = 'ru-RU';
module.exports = async (vuepressDestPath) => {
    const getSearchResultByQuery = await GetSearchResultByQuery(vuepressDestPath);
    if(!getSearchResultByQuery) {
        console.error('!getSearchResultByQuery');
    }

    return async (ctx, next) => {
        const searchQuery = ctx.query.search;
        if (ctx.req.url === '/') {
            const acceptLanguage = ctx.header['accept-language'];
            const cookieLang = ctx.cookie && ctx.cookie.lang;
            if(
              cookieLang === ruLangKey ||
              acceptLanguage.includes(ruLangKey) && !cookieLang
            ) {
                ctx.redirect('/ru/');
                return;
            }
            ctx.redirect('/en/');
            return;
        } else if(searchQuery) {
            const searchResult = await getSearchResultByQuery(searchQuery);
            ctx.body = searchResult;
        }
        await next();
    };
};
