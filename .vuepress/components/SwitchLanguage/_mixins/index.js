import ListItem from '../ListItem';

export default {
    components: {
        ListItem,
    },
    data() {
        return {
            isShowLangList: false,
        }
    },

    computed: {
        languageNavDropdown() {
            const {locales} = this.$site;
            let languageDropdown = [];
            if (locales && Object.keys(locales).length > 1) {
                const currentLink = this.$page.path
                const routes = this.$router.options.routes
                const themeLocales = this.$site.themeConfig.locales || {}
                languageDropdown = {
                    text: this.$themeLocaleConfig.selectText || 'Languages',
                    items: Object.keys(locales).map(path => {
                        const locale = locales[path];
                        const themeLocale = themeLocales[path];
                        const text = themeLocale && themeLocale.label || locale.lang;

                        let link
                        // Stay on the current page
                        if (locale.lang === this.$lang) {
                            link = currentLink
                        } else {
                            // Try to stay on the same page
                            link = currentLink.replace(this.$localeConfig.path, path)
                            // fallback to homepage
                            if (!routes.some(route => route.path === link)) {
                                link = path
                            }
                        }
                        return {
                            text,
                            link,
                            langIconRawSvg: themeLocale.langIconRawSvg,
                        }
                    })
                }
            }
            return languageDropdown;
        },
    },
    watch: {
        '$page.path'() {
            document.removeEventListener('click', this.langListDocumentHandler);
            this.isShowLangList = false;
        },
    },
    methods: {
        langListDocumentHandler(event) {
            const isClickOnThisComponentElements = event.path.some(element => {
                return element === this.$refs.root;
            })
            if (this.isShowLangList && !isClickOnThisComponentElements) {
                document.removeEventListener('click', this.langListDocumentHandler);
                this.isShowLangList = false;
            }
        },
        toggleLangList() {
            if (this.isShowLangList) {
                document.removeEventListener('click', this.langListDocumentHandler);
            } else {
                document.addEventListener('click', this.langListDocumentHandler);
            }
            this.isShowLangList = !this.isShowLangList;
        },

        selectLanguage(languageItem) {
            const languageItemLink = languageItem.link;
            const pagePath = this.$page.path;
            if (this.$themeConfig.locales[languageItemLink] && !this.$themeConfig.locales[pagePath]) {
                this.$store.commit('setDisplayShowLanguageNotification', true);
                this.isShowLangList = false;
                return;
            }

            if (languageItemLink !== this.$page.path) {
                this.$router.push(languageItemLink)
            }

        },
    },

    beforeDestroy() {
        document.removeEventListener('click', this.langListDocumentHandler);
    },
}