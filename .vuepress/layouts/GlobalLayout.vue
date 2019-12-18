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
                if (this.$page.path) {
                    if (this.$route.query.contentOnly && this.$frontmatter.layout !== 'ForPdf') {
                        return 'OnlyContent';
                    }
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
            if(!this.$isServer) {
                await this.$nextTick();
                document.body.style.transition = 'opacity .3s';
                document.body.style.opacity = 1;
            }
        },
    }
</script>
