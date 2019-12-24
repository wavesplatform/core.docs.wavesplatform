<template>
    <component
        :is="iconComponentName"
        :class="[
            $style.root,
            $style[`root_size${size}`],
        ]"
    />
</template>

<script>
    import WarningIcon from './WarningIcon'
    import TipIcon from './TipIcon'
    import InfoIcon from './InfoIcon'
    export default {
        name: 'NoteIcon',
        components: {
            WarningIcon,
            InfoIcon,
            TipIcon
        },
        props: {
            type: {
                type: String,
                validator(value) {
                    return ['warning', 'tip', 'info', 'error'].includes(value);
                },
                default: 'info',
            },
            size: {
                type: [String, Number],
                validator(value) {
                    return [1, 2].includes(value);
                },
                default: 1,
            }
        },
        computed: {
          iconComponentName() {
            switch (this.type) {
                case 'warning':
                case 'error':
                    return 'WarningIcon';
                case  'tip':
                    return 'TipIcon';
                case  'info':
                    return 'InfoIcon';
            }
          },
        },
    }
</script>
<style lang="stylus" module>
    .root {

    }
    .root_size1 {
        width 24px
        height 23px
    }
    .root_size2 {
        width 20px
        height 20px
    }
</style>
