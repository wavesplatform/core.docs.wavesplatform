import setThemeColoration from './enhanceApp/setThemeColoration'
import elementResizeDetector from './enhanceApp/elementResizeDetector'
import routing from './enhanceApp/routing'
import vuex from './enhanceApp/vuex'
import elementUi from './enhanceApp/elementUi'
import scrollTo from './enhanceApp/scrollTo'
import setTitle from './enhanceApp/setTitle'

export default (context) => {
    setThemeColoration(context);
    scrollTo(context);
    elementResizeDetector(context);
    const store = vuex(context);
    routing(context, store);
    setTitle(context, store);
    elementUi(context);
}
