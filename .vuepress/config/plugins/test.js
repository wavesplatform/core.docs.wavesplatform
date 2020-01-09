const getFlatSidebarItems = (items, accumulator = []) => {
  if(!items) {
    return accumulator;
  }
  return items.reduce((accumulator, item) => {
    accumulator.push(item);
    if(item.children) {
      getFlatSidebarItems(item.children, accumulator);
    }
    return accumulator;
  }, accumulator);
};

module.exports = (options, context) => {
  console.log('context:', context, context.themeConfig.locales);
  const flatSidebarLinks = Object.values(context.themeConfig.locales).reduce((accumulator, locale) => {
    Object.values(locale.sidebar).forEach(sidebarGroup => {
      getFlatSidebarItems(sidebarGroup, accumulator)
    });
    return accumulator;
  }, []);

  // context.themeConfig.locales.
  // console.log('context:', context);
  // let pages = context.__proto__.pages;
  //
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

  const pages = context.__proto__.pages;
  Object.defineProperty(pages, "push", {
    value(page) {
      const isPageAvailableInSidebar = flatSidebarLinks.some(sidebarLink => {
        return sidebarLink.path === page.path;
      });
      if(isPageAvailableInSidebar) {
        console.log(page);
        pages[pages.length] = page;
      }
      return pages;
    }
  });


  console.log('flatSidebarLinks:', flatSidebarLinks, pages, pages.length);
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
