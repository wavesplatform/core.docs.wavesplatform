module.exports = () => {
    return async(ctx, next) => {
        try {
            await next();
            if (ctx.status === 404) {

                const acceptLanguage = ctx.header['accept-language'];
                const cookieLang = ctx.cookie && ctx.cookie.lang;
                if(global.defaultLocale && !cookieLang) {
                    ctx.redirect('/en/404');
                    return;
                }
                if(
                  cookieLang === global.ruLangKey ||
                  acceptLanguage.includes(global.ruLangKey) && !cookieLang
                ) {
                    ctx.redirect('/ru/404');
                    return;
                }
                ctx.redirect('/en/404');
                // return;
                // ctx.redirect(`${ctx.protocol}://${ctx.headers.host}/404.html`);
            }
        } catch (err) {

        }
    }
};
