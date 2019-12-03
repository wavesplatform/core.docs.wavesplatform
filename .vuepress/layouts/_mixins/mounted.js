export default {
    async mounted () {
        await this.$nextTick();
        if(!this.$isServer) {
            document.body.style.transition = 'opacity .3s';
            document.body.style.opacity = 1;
        }
    },
};
