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
                })
            }
        },
    }
</script>

<style lang="stylus" module>
    .root {
        transition opacity $transitionS1
    }
</style>
