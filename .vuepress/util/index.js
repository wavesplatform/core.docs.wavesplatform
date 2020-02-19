export const hashRE = /#.*$/;
export const extRE = /\.(md|html)$/;
export const endingSlashRE = /\/$/;
export const outboundRE = /^(https?:|mailto:|tel:)/;

export function normalize (path) {
    let normalizePath = decodeURI(path)
        .replace(hashRE, '')
        .replace(extRE, '');
    if(normalizePath.slice(-1) === '/') {
        normalizePath = normalizePath.slice(0, -1);
    }
  return normalizePath;
}

export function getHash (path) {
    if(!path) {
        return
    }
  const match = path.match(hashRE);
  if (match) {
    return match[0];
  }
}

export function isExternal (path) {
  return outboundRE.test(path);
}

export function isMailto (path) {
  return /^mailto:/.test(path);
}

export function isTel (path) {
  return /^tel:/.test(path);
}

export function ensureExt (path) {
  if (isExternal(path)) {
    return path;
  }
  const hashMatch = path.match(hashRE);
  const hash = hashMatch ? hashMatch[0] : '';
  const normalized = normalize(path);

  if (endingSlashRE.test(normalized)) {
    return path;
  }
  return normalized + '.html' + hash;
}

export function isActive (route, path) {
    const routeHash = route.hash
    const linkHash = getHash(path)
    if (linkHash && routeHash !== linkHash) {
        return false
    }

    const routePath = normalize(route.path)
    const pagePath = normalize(path)
    return routePath === pagePath
}

export function resolvePage (pages, rawPath, base) {
  if (base) {
    rawPath = resolvePath(rawPath, base);
  }
  const path = normalize(rawPath);



  for (let i = 0; i < pages.length; i++) {
    if (normalize(pages[i].regularPath) === path) {
      return Object.assign({}, pages[i], {
        type: 'page',
        path: ensureExt(pages[i].path)
      });
    }
  }
  console.error(`[vuepress] No matching page found for sidebar item "${rawPath}"`);
  return {};
}

function resolvePath (relative, base, append) {
  const firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative;
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative;
  }

  const stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/');
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/');
}

/**
 * @param { Page } page
 * @param { string } regularPath
 * @param { SiteData } site
 * @param { string } localePath
 * @returns { SidebarGroup }
 */
export function resolveSidebarItems (page, regularPath, site, localePath, localeConfig) {
  const { pages/*, themeConfig*/ } = site;

  // const localeConfig = localePath && themeConfig.locales
  //   ? themeConfig.locales[localePath] || themeConfig
  //   : themeConfig;

  const pageSidebarConfig = page.frontmatter.sidebar || localeConfig.sidebar || themeConfig.sidebar;
  if (pageSidebarConfig === 'auto') {
    return resolveHeaders(page);
  }

  const sidebarConfig = localeConfig.sidebar || themeConfig.sidebar;
  if (!sidebarConfig) {
    return [];
  } else {

    const { base, config } = resolveMatchingConfig(regularPath, sidebarConfig);

    return config
      ? config.map(item => resolveItem(item, pages, base))
      : [];
  }
}

/**
 * @param { Page } page
 * @returns { SidebarGroup }
 */
function resolveHeaders (page) {
  const headers = groupHeaders(page.headers || []);
  return [{
    type: 'group',
    collapsable: false,
    title: page.title,
    path: null,
    children: headers.map(h => ({
      type: 'auto',
      title: h.title,
      basePath: page.path,
      path: page.path + '#' + h.slug,
      children: h.children || []
    }))
  }];
}

export function groupHeaders (headers) {
  // group h3s under h2
  headers = headers.map(h => Object.assign({}, h));
  let lastH2;
  headers.forEach(h => {
    if (h.level === 2) {
      lastH2 = h;
    } else if (lastH2) {
      (lastH2.children || (lastH2.children = [])).push(h);
    }
  });
  return headers.filter(h => h.level === 2);
}

export function resolveNavLinkItem (linkItem) {
  return Object.assign(linkItem, {
    type: linkItem.items && linkItem.items.length ? 'links' : 'link'
  });
}

/**
 * @param { Route } route
 * @param { Array<string|string[]> | Array<SidebarGroup> | [link: string]: SidebarConfig } config
 * @returns { base: string, config: SidebarConfig }
 */
export function resolveMatchingConfig (regularPath, config) {
  if (Array.isArray(config)) {
    return {
      base: '/',
      config: config
    };
  }
  for (const base of Object.keys(config).reverse()) {
    if (ensureEndingSlash(regularPath).indexOf(encodeURI(base)) === 0) {
      return {
        base,
        config: config[base]
      };
    }
  }
  return {};
}

function ensureEndingSlash (path) {
  return /(\.html|\/)$/.test(path)
    ? path
    : path + '/';
}

function resolveItem (item, pages, base, groupDepth = 1) {
  if (typeof item === 'string') {
    return resolvePage(pages, item, base);
  } else if (Array.isArray(item)) {
    return Object.assign(resolvePage(pages, item[0], base), {
      title: item[1]
    });
  } else {
    // if (groupDepth > 3) {
    //   console.error(
    //     '[vuepress] detected a too deep nested sidebar group.'
    //   );
    // }
    const children = item.children || [];
    if (children.length === 0 && item.path) {

      return Object.assign(resolvePage(pages, item.path, base), {
        title: item.title,
        path: item.path,
      });
    }

    return {
      type: 'group',
      path: item.path,
      title: item.title,
      sidebarDepth: item.sidebarDepth,
      children: children.map(child => resolveItem(child, pages, base, groupDepth + 1)),
      collapsable: item.collapsable !== false
    };
  }
}

export function scrollToHashElement(hash, store) {
  if(!hash) {
    return
  }
  hash = decodeURI(hash);
  const isCyrillicHash = new RegExp('[А-я]').test(hash);
  if(isCyrillicHash) {
    hash = hash.replace(/л/gi, 'n');
  }
  // const locationHash = decodeURI(location.hash);
  // console.log('locationHash:', locationHash, hash)
  // if(hash === locationHash) {
  //   return;
  // }
  store.commit('setScrollTopState', true);
  const element = document.querySelector(hash);

  if(!element) {
    return;
  }
  const elementBoundingClientRect = element.getBoundingClientRect();
  const elementTopPosition = elementBoundingClientRect.top;
  const documentElementScrollTop = document.documentElement.scrollTop;
  const computedScrollTop = elementTopPosition + documentElementScrollTop - store.state.interface.headerHeight;
  window.scrollTo({
    behavior: 'smooth',
    top: computedScrollTop,
  }, () => {
    store.commit('setScrollTopState', false);
  });
}

export function getFlatSidebarItems(items, accumulator = []) {
  if(!items) {
    return accumulator;
  }
  return items.reduce((accumulator, item) => {
    accumulator.push(item);
    if(item.type === 'group') {
      getFlatSidebarItems(item.children, accumulator);
    }
    return accumulator;
  }, accumulator);
}

export function storeMutationGenerator(object) {
  return Object.entries(object).reduce((accumulator, setterEntry) => {
    accumulator[setterEntry[0]] = (state, value) => {
      setterEntry[1].split('.').reduce((accumulator, element, index, iterable) => {
        if(index + 1 === iterable.length) {
          accumulator[element] = value
        }
        return accumulator[element];
      }, state)
    };
    return accumulator;
  }, {});
}
