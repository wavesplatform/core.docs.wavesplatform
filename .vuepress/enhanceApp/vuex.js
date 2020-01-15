import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { storeMutationGenerator } from '../util'

export default (context) => {
    const { Vue, isServer } = context;
    const defaultFocusIndex = -1;
    let layoutWidth = 1920;
    let isBrowserSupportedBackdropFilter = true;

    if(!isServer) {
        layoutWidth = window.innerWidth;
        isBrowserSupportedBackdropFilter = 'backdropFilter' in document.body.style;
    }

    const state = {
        themeConfig: context.siteData.themeConfig,
        defaultLanguage: '',
        currentLanguage: '',
        interface: {
            isThemePainted: false,
            isBrowserSupportedBackdropFilter,
            isUserNaturalScrollState: false,
            isScrollTopState: false,
            documentElementScrollTop: 0,
            layoutWidth,
            layoutHeight: 0,
            headerHeight: 71,
            leftSidebarWidth: 0,
            leftSidebarMinWidthPx: 240,
            isOpenLeftSidebar: false,
            rightSidebarWidth: 0,
            rightSidebarAlwaysVisiblePartWidth: 50,
            isOpenRightSidebar: true,
            rightSidebarMinWidthPx: 190,
            isRightSidebarResizingState: false,
            mainContentPositionLeft: 0,
            mainContentHeight: 0,
            isShowSearchResultWindow: false,
        },
        isShowLanguageNotification: false,
        // isProcessDev: process.env.isDev,
        search: {
            query: '',
            defaultFocusIndex,
            focusIndex: defaultFocusIndex,
        },
        leftSidebarOpenedGroups: [],
    };

    if (!isServer) {
        state.defaultLanguage = navigator.language
    }

    const modules = {}

    const mutations = {
        ...storeMutationGenerator({
            setThemePaintedState: 'interface.isThemePainted',
            setUserNaturalScrollState: 'interface.isUserNaturalScrollState',
            setActiveColoration: 'themeConfig.activeColouration',
            setDisplaySearchResultWindow: 'interface.isShowSearchResultWindow',
            setScrollTopState: 'interface.isScrollTopState',
            setMainContentHeight: 'interface.mainContentHeight',
            setMainContentPositionLeft: 'interface.mainContentPositionLeft',
            setDocumentElementScrollTop: 'interface.documentElementScrollTop',
            setRightSidebarResizingState: 'interface.isRightSidebarResizingState',
            setDisplayRightSidebar: 'interface.isOpenRightSidebar',
            setDisplayLeftSidebar: 'interface.isOpenLeftSidebar',
            setLeftSidebarWidth: 'interface.leftSidebarWidth',
            setRightSidebarWidth: 'interface.rightSidebarWidth',
            setSearchSuggestionsFocusIndex: 'search.focusIndex',
            setInterfaceInnerWidthLayout: 'interface.layoutWidth',
            setInterfaceInnerHeightLayout: 'interface.layoutHeight',
            setCurrentLanguage: 'currentLanguage',
            setLeftSidebarOpenedGroups: 'leftSidebarOpenedGroups',
            setDisplayShowLanguageNotification: 'isShowLanguageNotification',
            setHeaderHeight: 'interface.headerHeight',
            setSearchQuery: 'search.query',
        }),
    };

    const actions = {};

    let vuexPersistence = null;
    if (!isServer) {
        vuexPersistence = new VuexPersistence({
            storage: window.localStorage,
            reducer: (state) => {
                const {
                    currentLanguage,
                    themeConfig: {
                        activeColouration,
                    },
                    interface: {
                        leftSidebarWidth,
                        isOpenLeftSidebar,
                        rightSidebarWidth,
                        isOpenRightSidebar,
                    },
                } = state;
                return {
                    currentLanguage,
                    themeConfig: {
                        activeColouration,
                    },
                    interface: {
                        leftSidebarWidth,
                        isOpenLeftSidebar,
                        rightSidebarWidth,
                        isOpenRightSidebar,
                    },
                };
            },
        });
    }

    const getters = {
        activeColorationConfig: state => {
            const themeConfig = state.themeConfig;
            return themeConfig.colouration[themeConfig.activeColouration]
        },
        activeColorationConfigColors(state) {
            return getters.activeColorationConfig(state).colors;
        },
    };

    Vue.use(Vuex);

    const store = new Vuex.Store({
        state,
        modules,
        mutations,
        actions,
        getters,
        plugins: vuexPersistence ? [vuexPersistence.plugin] : [],
    });

    Vue.mixin({
        store
    });

    return store
}
