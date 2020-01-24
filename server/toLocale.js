const ruLangKey = 'ru-RU';
const defaultLocale = 'en-US';

module.exports = () => {
    return async (ctx, next) => {
        if (ctx.req.url === '/') {
            const acceptLanguage = ctx.header['accept-language'];
            const cookieLang = ctx.cookie && ctx.cookie.lang;
            if(defaultLocale && !cookieLang) {
                ctx.redirect('/en/');
                return;
            }
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
