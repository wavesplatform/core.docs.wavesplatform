<template>
    <div v-if="$localePath !== '/'">
        <div :class="$style.versioning">
            <SwitchVersion/>
        </div>

        <!--<Dropdown2/>-->
        <component
                :is="layout"
                :class="$style.root"
                :style="{
            opacity: isShowRoot ? 1 : 0,
        }"
        />
    </div>

</template>

<script>
    import OnlyContent from './OnlyContent'
    import SwitchVersion from '@theme/components/SwitchVersion'
    import {scrollToHashElement} from '../util'

    import Dropdown2 from '@theme/components/Dropdown/Type2'

    export default {
        components: {
            OnlyContent,
            SwitchVersion,
            Dropdown2,
        },
        data() {
          return {
              isShowRoot: false,
          }
        },
        computed: {
            themeLocaleConfig() {
                return this.$store.getters.themeLocaleConfig;
            },
            currentDocsVersionName() {
              return this.$store.state.currentDocsVersionName;
            },
            isUserNaturalScrollState() {
                return this.$store.state.interface.isUserNaturalScrollState;
            },
            layout() {
                if (this.$page.path) {
                    if (this.$route.query.contentOnly && this.$frontmatter.layout !== 'ForPdf') {
                        return 'OnlyContent'
                    }
                    if (this.$frontmatter.layout) {
                        return this.$frontmatter.layout
                    }
                    return 'Layout'
                }

                return 'NotFound'
            },
            isThemePainted() {
              return this.$store.state.interface.isThemePainted;
            },
        },

        watch: {
            $route: {
                handler(route) {
                    this.$store.commit(
                            'setCurrentDocsVersionName',
                            route.path.replace(new RegExp(`${this.$localePath}(.*?)/(.*)`), '$1')
                    );
                },
                immediate: true,
            }
        },

        beforeCreate() {
            if(!this.$isServer) {
                window.vm = this;
            }
        },
        async mounted () {
            if(!this.$isServer) {
                this.$watch('isThemePainted', async(newValue) => {
                    if(newValue) {
                        await this.$nextTick();
                        this.isShowRoot = true;
                    }
                }, {
                    immediate: true,
                });

                document.addEventListener('click', (event) => {
                    const target = event.target;
                   if(target.tagName !== 'A') {
                       return;
                   }
                   if(target.href.replace(target.origin, '') === this.$route.fullPath) {
                       return;
                   }

                   if(new RegExp(location.host).test(target.href) && !('__vue__' in target)) {
                       event.preventDefault();
                       this.$router.replace(target.pathname + target.search + target.hash)
                       .catch(error => {
                           console.error(error)
                           if(error) {
                               this.$router.push(this.$localePath + '404');
                           }
                       });
                       return;
                   }
                   const targetHostname = target.hostname;
                   const isExternalUrl = targetHostname !== location.hostname;
                   let targetHash = decodeURI(target.hash);
                   const isCyrillicURI = new RegExp('[А-я]').test(targetHash);
                   if(isCyrillicURI) {
                       targetHash = targetHash.replace(/л/gi, 'n');
                   }
                   if(!isExternalUrl && targetHash) {
                       event.preventDefault();
                       scrollToHashElement(targetHash, this.$store);
                   }
                });

                this.$watch('$localeConfig', (newValue) => {
                    const localeLang = this.$store.state.locales[newValue.path][this.currentDocsVersionName].data.lang;
                    this.$store.commit('setCurrentLanguage', localeLang);
                    this.$cookies.set('lang', localeLang);
                }, {
                    immediate: true,
                });

            }
        },
    }
</script>

<style lang="stylus" module>


    .versioning {
        position fixed
        z-index 3
        margin 10px
        padding 10px
        background rgba(0, 0, 0, 0.4)
        border-radius 4px
        border 1px solid #000
        left 150px
    }



    .root {
        transition opacity $transitionS1
    }
</style>
