<template>
  <div :class="$style.root">
    <Navbar
            ref="navbar"
            :class="$style.navbar"
            type="content"
    />
<!--    <div :class="$style.navbarWrapper2">
      <WidthLimit
              :type="2"
              :class="$style.navbarWrapper"
      >
        <Navbar
                ref="navbar"
                :class="$style.navbar"
                type="content"
                :style="{
                        transform: (layoutWidth < 720 && isOpenLeftSidebar) ? `translateX(${leftSidebarWidth}px)` : '',
                    }"
        />
      </WidthLimit>
    </div>-->
  </div>
</template>

<script>
  import Navbar from '@theme/components/Navbar'
  import Page from '@theme/components/Page.vue'
  import Sidebar from '@theme/components/Sidebar/'
  import WidthLimit from '@theme/components/WidthLimit'
  import PageNavigations from '@theme/components/PageNavigations'
  import LanguageNotification from '@theme/components/LanguageNotification'
  // import ThemeControl from '@theme/components/ThemeControl'
  import watchLayoutSizeMixin from './_mixins/watchLayoutSize'
  import navbarResizeDetectorMixin from './_mixins/navbarResizeDetector'
  import searchMixin from '@theme/components/_mixins/search'
  import { resolveSidebarItems, scrollToHashElement } from '../util'

  export default {
    components: {
      Navbar
    },

    data() {
      return {

      }
    },

    computed: {

    },

    watch: {

    },

    beforeMount() {

    },

    mounted() {

    },

    updated() {

    },

    beforeDestroy() {

    },

    methods: {

    }
  }
</script>

<style lang="stylus" module>
  .root {
    display flex
    flex-direction column
    height 100%
    width 100vw
    overflow hidden
    align-items center
    min-height 100vh
  }

  .navbar {
    position fixed;
    /*left 0*/
    width 100vw
    flex-shrink 0
    z-index 1
    transition transform $transitionS1
  }

</style>
