import setThemeColoration from './enhanceApp/setThemeColoration'
import elementResizeDetector from './enhanceApp/elementResizeDetector'
import routing from './enhanceApp/routing'
import vuex from './enhanceApp/vuex'
import elementUi from './enhanceApp/elementUi'
import scrollTo from './enhanceApp/scrollTo'
import setTitle from './enhanceApp/setTitle'
import vueCookie from './enhanceApp/vueCookie'
// import themeLocaleConfig from './enhanceApp/themeLocaleConfig'
import deleteLocalesPathProp from './enhanceApp/deleteLocalesPathProp'
let isInit = false;
export default (context) => {
    if(isInit) {
        return
    }
    isInit = true;

    const isServer = context.isServer;
    if(!isServer) {
        window.isViewReady = false;
    }
    /*TODO: need review*/
    // deleteLocalesPathProp(context);
    /*/TODO: need review/*/
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
    // themeLocaleConfig(context, store);
    setTitle(context, store);
    elementUi(context);
    vueCookie(context);
}
