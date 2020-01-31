export default (context) => {
    Object.values(context.siteData.locales).forEach((locale) => {
        delete locale.path;
    });
};
