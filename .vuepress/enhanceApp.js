import setThemeColoration from './enhanceApp/setThemeColoration'
import elementResizeDetector from './enhanceApp/elementResizeDetector'
import routing from './enhanceApp/routing'
import vuex from './enhanceApp/vuex'
import elementUi from './enhanceApp/elementUi'
import scrollTo from './enhanceApp/scrollTo'
import setTitle from './enhanceApp/setTitle'
import vueCookie from './enhanceApp/vueCookie'
// import globalComponents from './enhanceApp/globalComponents';
let isInit = false;
export default (context) => {
    if(!context.isServer) {
        window.isViewReady = false;
    }
    if(isInit) {
        return
    }
    isInit = true;
    scrollTo(context);
    elementResizeDetector(context);
    const store = vuex(context);
    setThemeColoration(context, store);
    routing(context, store);
    setTitle(context, store);
    elementUi(context);
    vueCookie(context);
    // globalComponents(context);
}
