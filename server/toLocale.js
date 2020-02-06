module.exports = () => {
    return async (ctx, next) => {
        if (ctx.req.url === '/') {
            const acceptLanguage = ctx.header['accept-language'];
            const cookieLang = ctx.cookie && ctx.cookie.lang;
            if(global.defaultLocale && !cookieLang) {
                ctx.redirect('/en/');
                return;
            }
            if(
              cookieLang === global.ruLangKey ||
              acceptLanguage.includes(global.ruLangKey) && !cookieLang
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
