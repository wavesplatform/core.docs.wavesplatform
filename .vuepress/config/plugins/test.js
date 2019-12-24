module.exports = (options, context) => {
  // console.log('options, context:', options, context);
  return {
    name: 'test',

    extendPageData(page) {
      // console.log('page:', page, options, context)
      /*const { regularPath, frontmatter = {} } = page
      if (frontmatter.permalink) return
      if (regularPath === '/404.html') {
        // path for 404 page
        page.path = notFoundPath
      } else if (regularPath.endsWith('.html')) {
        // normal path
        // e.g. foo/bar.md -> foo/bar.html
        page.path = regularPath.slice(0, -5) + normalSuffix
      } else if (regularPath.endsWith('/')) {
        // index path
        // e.g. foo/index.md -> foo/
        page.path = regularPath.slice(0, -1) + indexSuffix
      }*/

    },
  }
};
