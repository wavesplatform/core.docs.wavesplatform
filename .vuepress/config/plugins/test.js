module.exports = (options, context) => {

  // console.log('context:', context);
  // let pages = context.__proto__.pages;

  // Object.defineProperty(context.__proto__, 'pages', {
  //   set(newValue) {
  //     console.log('newValue:', newValue);
  //     pages = newValue
  //   },
  //   get() {
  //     return pages
  //   },
  //   apply
  // });

  // const pages =
  // Object.defineProperty(context.__proto__.pages, "push", {
  //
  //   value(value) {
  //     console.log(value)
  //     // for (var i = 0, n = this.length, l = arguments.length; i < l; i++, n++) {
  //     //   RaiseMyEvent(this, n, this[n] = arguments[i]); // assign/raise your event
  //     // }
  //     // return n;
  //   }
  // });

  // pages.push = (value) => {
  //   console.log('push newValue:', value);
  //   return pages.__proto__.push(value);
  // };
  // Object.defineProperty(pages, 'push', {
  //   value() {
  //     context.__proto__.pages
  //
  //     return pages;
  //   }
  // });

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
}
