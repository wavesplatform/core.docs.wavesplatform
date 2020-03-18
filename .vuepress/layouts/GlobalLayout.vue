<template>
    <component
            :is="layout"
            :class="$style.root"
            :style="{
            opacity: isShowRoot ? 1 : 0,
        }"
    />
</template>

<script>
    import OnlyContent from './OnlyContent';
    import {scrollToHashElement} from '../util';
    export default {
        components: {
            OnlyContent,
        },
        data() {
            return {
                isShowRoot: false,
            }
        },
        computed: {
            isUserNaturalScrollState() {
                return this.$store.state.interface.isUserNaturalScrollState;
            },
            layout() {
                if (this.$page.path) {
                    if (this.$route.query.contentOnly && this.$frontmatter.layout !== 'ForPdf') {
                        return 'OnlyContent';
                    }
                    if (this.$frontmatter.layout) {
                        return this.$frontmatter.layout
                    }
                    return 'Layout'
                }

                return 'NotFound';
            },
            isThemePainted() {
                return this.$store.state.interface.isThemePainted;
            },
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
                // window.addEventListener('hashchange', (event) => {
                //     // event.preventDefault();
                // });

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
                        // target.href.replace(new RegExp(`${target.hash}$`), '')
                        const url = target.pathname + target.search + target.hash;
                        let routerFollowing = null;
                        if(target.pathname + target.search === location.pathname + location.search) {
                            routerFollowing = this.$router.replace(url);
                        } else {
                            routerFollowing = this.$router.push(url);
                        }
                        routerFollowing.catch(error => {
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
                    const localePath = newValue.path;
                    const localeLang = newValue.lang;
                    if(!localePath) {
                        return;
                    }
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
