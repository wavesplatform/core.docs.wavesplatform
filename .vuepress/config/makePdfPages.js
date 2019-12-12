const processEnv = process.env;
// const inspector = require('inspector');
// inspector.open(9229, '127.0.0.1');

const path = require('path');
const servePort = processEnv.port || 5000;
const serveHost = processEnv.host || '0.0.0.0';

const Koa = require('koa');
const serve = require(path.join(/*global.coreRootPath*/'../../', 'utils/koa-static'));
const puppeteer = require('puppeteer');

const magePdfPages = async (vuepressDestPath, pagePaths = []) => {

  const app = new Koa();

  if(!vuepressDestPath || !pagePaths.length) {
    return;
  }

  app.use(
    serve(
      vuepressDestPath, {
        extensions: ['html'],
      }
    )
  );


  let server = null;
  await new Promise(resolve => {
    server = app.listen(servePort, serveHost, () => {
      resolve();
      console.log(`Make PDF pages server run on ${serveHost}:${servePort}`);
    });
  });

  const browser = await puppeteer.launch(/*{}*/);

  for(const pagePath of pagePaths) {
    const pagePathParsed = path.parse(pagePath);
    const pathForSavePdf = `${path.join(vuepressDestPath, pagePathParsed.dir)}/${pagePathParsed.name}.pdf`;

    const page = await browser.newPage();

    await page.goto(`http://${serveHost}:${servePort + pagePath}`);

    await page.evaluate(async() => {
      // await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
      const vm = window.vm;
      if(!vm) {
        return;
      }
      const bodyElement = document.body;
      bodyElement.innerHTML='';
      bodyElement.append(vm.pageContentElement);
    });
    await page.emulateMedia('screen');
    await page.pdf({
      // format: 'Letter',
      format: 'A4',
      path: pathForSavePdf,
      printBackground: true,
      // width: 1440,
      // height: 0,
      scale: 1,
      margin: {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30,
      },
      displayHeaderFooter: false,
      // headerTemplate: '',
      // footerTemplate: '',
      landscape: false,
      // preferCSSPageSize: false,
    });
    await page.close();

    console.log(`${pathForSavePdf} created`);
  }

  await browser.close();

  server.close();
};

// magePdfPages();

module.exports = magePdfPages;


