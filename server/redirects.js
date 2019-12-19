module.exports = (redirectList) => {
    return async(ctx, next) => {
        if (Array.isArray(redirects)) {
            for (const redirectRule of redirects) {
                if (redirectRule.from === requestOriginalUrl) {
                    res.redirect(`${req.protocol}://${req.headers.host + redirectRule.to}`)
                    break
                }
            }
        }

        await next();
    };
};
