module.exports = (ctx) => {
    return {
        // options for markdown-it-anchor
        // anchor: { permalink: false },
        // options for markdown-it-toc
        // toc: { includeLevel: [1, 2] },
        extendMarkdown: md => {
            // use more markdown-it plugins!
            // md.use(require('markdown-it-xxx'))
            // console.log('md', md);
        }
    };
};