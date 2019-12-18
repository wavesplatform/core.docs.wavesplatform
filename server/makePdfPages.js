const processEnv = process.env;
// const inspector = require('inspector');
// inspector.open(9229, '127.0.0.1');

const path = require('path');
const servePort = processEnv.port || 5000;
const serveHost = processEnv.host || '0.0.0.0';
const envIsTest = processEnv.isTest;

const Koa = require('koa');
const serve = require(path.join(/*global.coreRootPath*/'../', 'utils/koa-static'));
const puppeteer = require('puppeteer');

const magePdfPages = async (vuepressDestPath, pagePaths = []) => {

  const app = new Koa();





  // pagePaths = pagePaths.slice(1, 4);





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


    // if(!pagePath.includes('for-pdf')) {
    //   continue
    // }

    const pagePathParsed = path.parse(pagePath);
    const pathForSavePdf = `${path.join(vuepressDestPath, pagePathParsed.dir)}/${pagePathParsed.name}.pdf`;

    const page = await browser.newPage();

    let contentOnlyParam = '?contentOnly=1';

    if(pagePath.slice(-1) === '/') {
      // contentOnlyParam = '/' + contentOnlyParam;
      contentOnlyParam = contentOnlyParam.substr(0,contentOnlyParam.length - 1);
    }

    console.log(`http://${serveHost}:${servePort + pagePath + contentOnlyParam}`)
    await page.goto(`http://${serveHost}:${servePort + pagePath + contentOnlyParam}`);


    if(pagePath.includes('for-pdf')) {
      let i = 1;
      const interval = setInterval(() => {
        if(i >= 30) {
          clearInterval(interval);
        }
        console.log('time:', i);
        i++
      }, 1000);
    }


    await page.evaluate(async() => {
      // await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
      const vm = window.vm;
      if(!vm) {
        return;
      }

      // if(!vm.isViewReady) {
      //   await new Promise((resolve, reject) => {
      //     Object.defineProperty(vm, 'isViewReady', {
      //       set(newValue) {
      //         if(newValue) {
      //           resolve();
      //         }
      //       },
      //     });
      //   });
      // }

      if(vm.$page.path.includes('for-pdf')) {
          await new Promise((resolve, reject) => {
            setTimeout(resolve, 30000)
          });
      }

    });
    await page.emulateMedia('screen');

    const sideIndentSizes = 30;

    await page.pdf({
      // format: 'Letter',
      format: 'A4',
      path: pathForSavePdf,
      printBackground: true,
      // width: 1440,
      // height: 0,
      scale: 1,
      margin: {
        top: 20,
        bottom: 60,
        left: sideIndentSizes,
        right: sideIndentSizes,
      },
      displayHeaderFooter: true,
      // headerTemplate: `<div style="font-size: 11px; padding: 0 30px"><div class='date'></div><div class='title'></div></div>`,

      /*<div class='url'></div>*/
      footerTemplate: `<div style="max-height: 50px;font-size: 11px;width: 100%; padding: 0 ${sideIndentSizes / 2}px">
            <div style="display: flex; justify-content: center; align-items: center; height: 100%;border-top: 1px solid #ccc;padding-top: 10px">
                <span class='pageNumber'></span> / <span class='totalPages'></span>
            </div>
        </div></div>
      `,
      landscape: false,
      // preferCSSPageSize: false,
    });
    await page.close();

    console.log(`${pathForSavePdf} created`);
  }

  await browser.close();

  server.close();
};

if(envIsTest) {
  magePdfPages('/Users/sbibik/Desktop/portecosys/projects/docs.waves.exchange/dist', ['/en/for-pdf', '/en/waves-matcher/matcher-settings']);
}


module.exports = magePdfPages;


