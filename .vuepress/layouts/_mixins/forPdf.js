export default {
    beforeCreate() {
        if(!this.$isServer) {
            document.documentElement.style.setProperty('--color11', 'rgba(255, 255, 255, 1)');
            document.documentElement.style.setProperty('--color7', '#263241');
            document.documentElement.style.setProperty('--color8', '#7f8fa4');
            document.documentElement.style.setProperty('--color1', '#f8f9fb');

        }
    },
};
