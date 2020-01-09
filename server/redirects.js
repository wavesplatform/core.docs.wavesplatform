const path = require('path');
const url = require('url');
const checkedExtensionsForRedirect = ['', '.html', '.md'];
const removeExtensionPartFromUrl = (url) => {
    const urlPathParsed = path.parse(url);
    return urlPathParsed.dir;
};

module.exports = (redirectList = []) => {
    return async(ctx, next) => {
        const requestOriginalUrl = ctx.originalUrl;
        const originalUrlParsed = url.parse(requestOriginalUrl);
        const urlPathParsed = path.parse(requestOriginalUrl);
        if(!redirectList.length) {
            await next();
            return;
        }

        const isUrlPathExtensionNeedRedirect = checkedExtensionsForRedirect.some(extension => {
            return extension === urlPathParsed.ext;
        });

        if(!isUrlPathExtensionNeedRedirect) {
            await next();
            return;
        }

        for (const redirectRule of redirectList) {
            const redirectRuleFrom = redirectRule.from;
            const redirectRuleTo = redirectRule.to;
            const isTestMatch = new RegExp(redirectRuleFrom).test(originalUrlParsed.path);
            console.log('isTestMatch', urlPathParsed, isTestMatch, originalUrlParsed);


            if(!isTestMatch) {
                continue
            }
            const isExternalLinkTo = redirectRuleTo.slice(0, 4) === 'http';

            if (
              redirectRuleTo &&
              redirectRuleFrom === requestOriginalUrl
            ) {
                ctx.redirect(
                  removeExtensionPartFromUrl(
                    isExternalLinkTo ? redirectRuleTo : `${ctx.protocol}://${ctx.headers.host + redirectRuleTo}`
                  )
                );
                return;
            }

            let regexpResult = '';

            if(redirectRuleFrom && redirectRuleTo) {
                let originalUrl = requestOriginalUrl;
                if(isExternalLinkTo) {
                    originalUrl = redirectRuleTo;
                }
                regexpResult = originalUrl.replace(new RegExp(redirectRuleFrom), redirectRuleTo);
            }

            if(regexpResult && requestOriginalUrl !== regexpResult) {
                ctx.redirect(
                  removeExtensionPartFromUrl(
                    isExternalLinkTo ? regexpResult : `${ctx.protocol}://${ctx.headers.host + regexpResult}`
                  )
                );
                return;
            }

        }
        await next();
    };
};
