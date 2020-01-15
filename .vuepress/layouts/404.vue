<template>
  <div :class="$style.root">
    <Navbar
            ref="navbar"
            :class="$style.navbar"
            type="content"
            :options="{
              isShowSidebar: false,
            }"
    />

    <div :class="$style.content">
      <Icon404/>
      <span>Something’s missing</span>
      <span>The page you are looking for is not found</span>

    </div>
  </div>
</template>

<script>
  import Navbar from '@theme/components/Navbar'
  import Icon404 from './404/Icon404'

  export default {
    components: {
      Navbar,
      Icon404,
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
    justify-content center
  }

  .navbar {
    position fixed;
    /*left 0*/
    width 100vw
    flex-shrink 0
    z-index 1
    transition transform $transitionS1
    top 0
    left 0
  }
  .content {
    display flex
    flex-direction column
    align-items center
  }
</style>
