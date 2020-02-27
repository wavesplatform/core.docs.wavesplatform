<template>
    <component
        :class="[
            $style.root,
            isBrowserSupportedBackdropFilter && $style.root_withBackdropFilter,
        ]"
        :is="componentName"
        v-bind="{
            ...options,
        }"
    >
        <div slot="rootBackground" :class="[$style.rootBackground, isBrowserSupportedBackdropFilter && $style.rootBackground_withBackdropFilter]"/>
    </component>
</template>

<script>
  import ForHomePage from './ForHomePage'
  import ForContentPage from './ForContentPage'

  export default {
    props: {
        type: {
            type: String,
            default: 'home',
            validator(value) {
                return ['home', 'content'].includes(value);
            },
        },
        options: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        isBrowserSupportedBackdropFilter() {
            return this.$store.state.interface.isBrowserSupportedBackdropFilter;
        },
      componentName() {
        if(this.type === 'home') {
          return 'ForHomePage';
        } else {
          return 'ForContentPage';
        }
      },
    },

    components: {
      ForHomePage,
      ForContentPage,
    },
  }
</script>

<style lang="stylus" module>
    .root {
        display flex
        height 72px
        border-bottom 1px solid var(--borderColor)
        justify-content center
        width 100%
        @media screen and (max-width: 719px) {
            height 57px
        }
    }
    .rootBackground{
        position absolute
        width 100%
        height 100%
        z-index -1
        &:not(.rootBackground_withBackdropFilter) {
            background-color var(--color11)
        }
    }
    .rootBackground_withBackdropFilter {
        backdrop-filter blur(4px)
        background-color var(--color11_alpha2)
    }
</style>
