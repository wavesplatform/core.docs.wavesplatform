<template>
    <div v-if="$localePath !== '/'">
        versioning:
        <SwitchVersion/>
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
    import OnlyContent from './OnlyContent';
    import SwitchVersion from '@theme/components/SwitchVersion'
    import {scrollToHashElement} from '../util';
    export default {
        components: {
            OnlyContent,
            SwitchVersion
        },
        data() {
          return {
              isShowRoot: false,
          }
        },
        computed: {
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
                   if(new RegExp(location.host).test(target.href) && !('__vue__' in target)) {
                       event.preventDefault();
                       this.$router.push(target.pathname + target.search + target.hash)
                       .catch(error => {
                           console.error(error)
                           if(error) {
                               this.$router.push('/404');
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
                    const localeLang = newValue[this.currentDocsVersionName].data.lang;
                    this.$store.commit('setCurrentLanguage', localeLang);
                    this.$cookies.set('lang', newValue.lang);
                }, {
                    immediate: true,
                });

            }
        },
    }
</script>

<style lang="stylus" module>
    .root {
        transition opacity $transitionS1
    }
</style>
