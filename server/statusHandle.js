module.exports = () => {
    return async(ctx, next) => {
        try {
            await next();
            if (ctx.status === 404) {
                ctx.redirect(`${ctx.protocol}://${ctx.headers.host}/404.html`);
                // do somthing here
            }
        } catch (err) {
            // handle error
        }
    }
};
