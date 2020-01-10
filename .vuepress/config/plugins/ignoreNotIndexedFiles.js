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
  const pages = context.__proto__.pages;

  const flatSidebarLinks = Object.values(context.themeConfig.locales).reduce((accumulator, locale) => {
    Object.values(locale.sidebar).forEach(sidebarGroup => {
      getFlatSidebarItems(sidebarGroup, accumulator)
    });
    return accumulator;
  }, []);

  Object.defineProperty(pages, 'push', {
    value(page) {
      const pagePath = page.path;
      const isPageAvailableInSidebar = flatSidebarLinks.some(sidebarLink => {
        return sidebarLink.path === pagePath;
      }) || Object.keys(context.themeConfig.locales).some(localePath => {
        return localePath === pagePath;
      });
      if(isPageAvailableInSidebar) {
        // console.log(page);
        pages[pages.length] = page;
      }
      return pages;
    }
  });

  return {
    // name: 'ignoreNotIndexedFiles',
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
