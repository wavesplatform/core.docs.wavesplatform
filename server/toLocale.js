const ruLangKey = 'ru-RU';
module.exports = () => {
    return async (ctx, next) => {
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
        }
        await next();
    };
};
