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
        currentDocsVersionName() {
            return this.$store.state.currentDocsVersionName;
        },
        themeLocaleConfig() {
            return this.$store.getters.themeLocaleConfig;
        },
        languageNavDropdown() {
            return Object.entries(this.$site.locales).map(localeEntry => {
                const localePath = localeEntry[0];
                const localeValue = localeEntry[1];
                let versionName = this.currentDocsVersionName;
                let localeVersion = localeValue[versionName];
                if(!localeVersion) {
                    const lastLocaleVersionEntry = this.getLastLocaleVersionEntry(localePath);
                    versionName = lastLocaleVersionEntry[0];
                    localeVersion = lastLocaleVersionEntry[1];
                }
                const localeVersionData = localeVersion.data;
                return {
                    text: localeVersionData.label,
                    link: this.$page.path.replace(
                      this.$localePath + this.currentDocsVersionName,
                      localePath + versionName
                    ),
                    langIconRawSvg: localeVersionData.langIconRawSvg,
                };
            });
        },
    },
    watch: {
        '$page.path'() {
            document.removeEventListener('click', this.langListDocumentHandler);
            this.isShowLangList = false;
        },
    },
    methods: {
        getLastLocaleVersionEntry(localePath) {
            let localeLastVersionEntry = null;
            for (const localeEntry of Object.entries(this.$site.locales[localePath])) {
                if(localeEntry[0] !== 'path') {
                    localeLastVersionEntry = localeEntry;
                }
            }
            return localeLastVersionEntry;
        },

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


            if (locales[languageItemLink] && !locales[pagePath]) {
                this.$store.commit('setDisplayShowLanguageNotification', true);
                this.isShowLangList = false;
                return;
            }

            if (languageItemLink !== pagePath) {
                this.$router.push(languageItemLink)
            }

        },
    },

    mounted() {
      console.log('languageNavDropdown:', this.languageNavDropdown)
    },

    beforeDestroy() {
        document.removeEventListener('click', this.langListDocumentHandler);
    },
}
