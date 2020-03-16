const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = (vuepressDestPath) => {
  return (vuepressPages, pagesParamsList, start, end) => {
    const pagesQueue = [];
    pagesParamsList.slice(start, end).forEach(pageParams => {
      pagesQueue.push((async() => {
        let vuepressPagePath = pageParams.path;
        const vuepressPageTitle = pageParams.title;
        const vuepressPageLocalePath = pageParams.localePath;

        if(vuepressPagePath.slice(-1) === '/') {
          vuepressPagePath = `${vuepressPagePath}index.html`;
        }
        const pagePath = decodeURI(path.join(vuepressDestPath, vuepressPagePath));
        const vuepressPageContent = await readFileAsync(pagePath)
          .then(result => {
            return result.toString()
          })
          .catch(error => {
            console.error(error);
          });

        const dom = new JSDOM(vuepressPageContent);
        let vuepressPageText = '';
        const pageDomMainElement = dom.window.document.querySelector('main');

        if(pageDomMainElement) {
          vuepressPageText = pageDomMainElement.textContent;
        }
        let vuepressPagesLocalePath = vuepressPages[vuepressPageLocalePath];
        if(!vuepressPagesLocalePath) {
          vuepressPages[vuepressPageLocalePath] = vuepressPagesLocalePath = {};
        }
        vuepressPagesLocalePath[vuepressPagePath] = {
          path: vuepressPagePath,
          title: vuepressPageTitle,
          localePath: vuepressPageLocalePath,
          content: vuepressPageText.replace(/(?:\r\n|\r|\n)/g, ''),
        };
        console.log('Parsed page:', vuepressPagePath);
      })())
    });
    return pagesQueue;
  }
};
