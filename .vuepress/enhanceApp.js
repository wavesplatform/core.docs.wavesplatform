import setThemeColoration from './enhanceApp/setThemeColoration'
import elementResizeDetector from './enhanceApp/elementResizeDetector'
import routing from './enhanceApp/routing'
import vuex from './enhanceApp/vuex'
import elementUi from './enhanceApp/elementUi'
import scrollTo from './enhanceApp/scrollTo'
import setTitle from './enhanceApp/setTitle'
import vueCookie from './enhanceApp/vueCookie'
// import googleTagManager from './enhanceApp/googleTagManager'
let isInit = false;
export default (context) => {
    const isServer = context.isServer;
    if(!isServer) {
        window.isViewReady = false;
    }
    if(isInit) {
        return
    }
    isInit = true;
    const gtmId = context.siteData.themeConfig.gtmId;
    if(!isServer && gtmId) {
        import('./enhanceApp/googleTagManager').then(module => {
            module.default(context, gtmId);
        });
    }
    scrollTo(context);
    elementResizeDetector(context);
    const store = vuex(context);
    setThemeColoration(context, store);
    routing(context, store);
    setTitle(context, store);
    elementUi(context);
    vueCookie(context);
}
