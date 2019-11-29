export default (context, store) => {
    const { Vue, siteData, isServer } = context;
    const locales = siteData.locales;
    const customTitle = siteData.title;
    const currentLanguage = store.state.currentLanguage;
    // console.log('context:', context);
    // Vue.mixin({
    //     computed: {
    //         $title() {
    //             return currentLanguage
    //         }
    //     }
    // })
};
