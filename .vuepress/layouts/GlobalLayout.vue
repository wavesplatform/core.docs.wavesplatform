<template>
    <component :is="layout"></component>
</template>

<script>
    import OnlyContent from './OnlyContent';
    export default {
        components: {
            OnlyContent,
        },
        computed: {
            layout() {
                if (this.$route.query.contentOnly) {
                    return 'OnlyContent';
                }
                if (this.$page.path) {
                    if (this.$frontmatter.layout) {
                        return this.$frontmatter.layout
                    }
                    return 'Layout'
                }

                return /*'404'*/'NotFound';
            }
        },
        beforeCreate() {
            if(!this.$isServer) {
                window.vm = this;
            }
        },
        async mounted () {
            await this.$nextTick();
            if(!this.$isServer) {
                document.body.style.transition = 'opacity .3s';
                document.body.style.opacity = 1;
            }
        },
    }
</script>
