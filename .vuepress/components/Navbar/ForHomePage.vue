<template>
    <header :class="$style.root">
        <WidthLimit
            :class="$style.root__wrapper"
            :type="2"
        >
            <Logotype :class="$style.logotype"/>
            <SwitchLanguage :class="$style.switchLanguage"/>
        </WidthLimit>
    </header>
</template>

<script>
    import overallMixin from './overallMixin'
    export default {
        mixins: [
          overallMixin
        ],

    }
</script>

<style lang="stylus" module>
    @import '~@themeExtend/components/Navbar/ForHomePage';

    .root {

    }

    .root__wrapper {
        display flex
        width 100%
        justify-content space-between
        position relative
        align-items center
    }


    .logotype {


        height 100%
        width 100%
    }

    .switchLanguage {
        visibility visible
    }
</style>

