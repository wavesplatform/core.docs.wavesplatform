export default (context, store) => {
    store.watch((state) => {
        return state.currentLanguage;
    }, (newValue) => {
        console.log('newValue:', newValue);
        let localeName = '';
        for(const localeEntry of Object.entries(context.siteData.locales)) {
            if(localeEntry[1].lang === newValue) {
                localeName = localeEntry[0];
                break;
            }
        }
        context.Vue.set(context.Vue.prototype, '$themeLocaleConfig', context.siteData.themeConfig.locales[localeName]);
        // context.Vue.prototype.$themeLocaleConfig = context.siteData.themeConfig.locales[localeName];
    }, {
        immediate: true
    });
};
