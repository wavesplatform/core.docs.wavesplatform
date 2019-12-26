const path = require('path');

module.exports = (redirectList = []) => {
    return async(ctx, next) => {
        const requestOriginalUrl = ctx.originalUrl;

        const urlParsedPath = path.parse(requestOriginalUrl);

        if(urlParsedPath.ext) {
            await next();
            return;
        }

        if (Array.isArray(redirectList)) {
            for (const redirectRule of redirectList) {
                if (redirectRule.from === requestOriginalUrl) {
                    ctx.redirect(`${ctx.protocol}://${ctx.headers.host + redirectRule.to}`)
                    // break;
                    return;
                }
                const regexpResult = requestOriginalUrl.replace(new RegExp(redirectRule.from), redirectRule.to);
                if(requestOriginalUrl !== regexpResult) {
                    ctx.redirect(`${ctx.protocol}://${ctx.headers.host + regexpResult}`);
                    return;
                }
            }
        }
        await next();
    };
};
