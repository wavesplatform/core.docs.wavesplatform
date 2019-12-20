export default (context, store) => {
    const { isServer } = context
    if(!isServer) {
        const themeConfig = context.siteData.themeConfig;
        const currentColorationConfig = themeConfig.colouration[themeConfig.activeColouration];
        Object.entries(currentColorationConfig.colors).forEach(colorationPropEntry => {
            document.documentElement.style.setProperty(`--${colorationPropEntry[0]}`, colorationPropEntry[1]);
        });
        store.commit('setThemePaintedState', true);
    }
};
