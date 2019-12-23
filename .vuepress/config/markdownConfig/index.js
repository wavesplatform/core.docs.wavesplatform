module.exports = (ctx) => {
    return {
        // options for markdown-it-anchor
        // anchor: { permalink: false },
        // options for markdown-it-toc
        // toc: { includeLevel: [1, 2] },

        extendMarkdown: md => {
            // use more markdown-it plugins!
            md.use((md, options) => {










                console.log('md', md, options);












            });
            // console.log('md', md);
        },

        // plugins: [
        //     '@org/foo', // equals to @org/markdown-it-foo if exists
        //     ['markdown-it-bar', {
        //         // provide options here
        //     }]
        // ]

        // plugins: {
        //     '@org/foo': {},
        //     'markdown-it-bar': {
        //         // provide options here
        //     }
        // },

    };
};
