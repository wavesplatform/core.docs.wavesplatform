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
        themeLocaleConfig() {
            return this.$store.getters.themeLocaleConfig;
        },

        languageNavDropdown() {
            const { locales } = this.$site;

            let languageDropdown = [];

            const currentLink = this.$page.path;

            const routes = this.$router.options.routes;


            Object.keys(locales).forEach(path => {
                const locale = locales[path][this.$store.state.currentDocsVersionName].data;
                const text = locale && locale.label || locale.lang;
                let link;

                if (locale.lang === this.$lang) {
                    link = currentLink
                } else {
                    link = currentLink.replace(this.$localeConfig.path, path);
                    if (!routes.some(route => route.path === link)) {
                        link = path
                    }
                }
                languageDropdown.push({
                    text,
                    link,
                    langIconRawSvg: locale.langIconRawSvg,
                });
            });

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
            const locales = this.$site.locales;

            console.log('languageItem:', languageItem, this.languageNavDropdown, languageItemLink, locales[languageItemLink]);

            if (locales[languageItemLink] && !locales[pagePath]) {
                console.log('test')
                this.$store.commit('setDisplayShowLanguageNotification', true);
                this.isShowLangList = false;
                return;
            }

            if (languageItemLink !== pagePath) {
                console.log('test2');
                this.$router.push(languageItemLink)
            }

        },
    },

    beforeDestroy() {
        document.removeEventListener('click', this.langListDocumentHandler);
    },
}
