<template>
    <header :class="$style.root">

        <WidthLimit
            :class="$style.root__wrapper"
            :type="2"
        >
            <Logotype :class="$style.logotype"/>

            <WidthLimit
                    v-show="layoutWidth > 719"
                    :class="[$overallStyle.searchBoxWrapper, $style.searchBoxWrapper]"
                    :type="1"
                    :padding-l-r="3"
                    :style="{
                        opacity: isShowSearchInHeaderHomePage ? '' : 0,
                        pointerEvents: isShowSearchInHeaderHomePage ? '' : 'none',
                    }"
            >
                <SearchBox
                        :class="$overallStyle.searchBox"
                        :is-full-size="true"
                        :size="1"
                        :with-suggestions="false"
                        @up="layoutWidth > 719 && suggestionsUp"
                        @down="layoutWidth > 719 && suggestionsDown"
                        @search="search"
                />
                <WidthLimit
                        v-show="!isShowSearchResultWindow"
                        :class="$overallStyle.searchSuggestionsWrapper"
                        :type="1"
                        :padding-l-r="3"
                >
                    <Suggestions
                            ref="suggestions"
                            :class="$style.searchSuggestions"
                    />
                </WidthLimit>
            </WidthLimit>

            <SwitchLanguage :class="$style.switchLanguage"/>
        </WidthLimit>
    </header>
</template>

<script>
    import { mapState } from 'vuex'
    import overallMixin from './overallMixin'
    export default {
        mixins: [
          overallMixin
        ],
        computed: {
            isShowSearchInHeaderHomePage() {
              return this.$store.state.interface.isShowSearchInHeaderHomePage;
            },
            // ...mapState([
            //     'interface.isShowSearchInHeaderHomePage',
            // ]),
        },
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

    .searchBoxWrapper {
        transition opacity $transitionS1
    }

    .switchLanguage {
        visibility visible
    }
</style>

