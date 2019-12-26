const path = require('path');

module.exports = (redirectList = []) => {
    // console.log('urlParsedPath123:',);
    return async(ctx, next) => {
        const requestOriginalUrl = ctx.originalUrl;
        const urlParsedPath = path.parse(requestOriginalUrl);

        // console.log('urlParsedPath:', urlParsedPath);

        if(!redirectList.length) {
            await next();
            return;
        }

        switch (urlParsedPath.ext) {
            case '':
            case '.html':
            case '.md':
                for (const redirectRule of redirectList) {
                    const redirectRuleFrom = redirectRule.from;
                    const redirectRuleTo = redirectRule.to;
                    if (redirectRuleTo && redirectRuleFrom === requestOriginalUrl) {
                        ctx.redirect(`${ctx.protocol}://${ctx.headers.host + redirectRuleTo}`)
                        return;
                    }
                    let regexpResult = '';
                    if(redirectRuleFrom && redirectRuleTo) {
                        regexpResult = requestOriginalUrl.replace(new RegExp(redirectRuleFrom), redirectRuleTo);
                    }
                    if(regexpResult && requestOriginalUrl !== regexpResult) {
                        ctx.redirect(`${ctx.protocol}://${ctx.headers.host + regexpResult}`);
                        return;
                    }
                }
        }
        await next();
    };
};
