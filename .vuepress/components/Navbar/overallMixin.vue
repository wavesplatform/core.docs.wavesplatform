<script>
    import WidthLimit from '@theme/components/WidthLimit'
    import SearchBox from '@theme/components/SearchBox/'
    import SidebarButton from '@theme/components/SidebarButton.vue'
    import Suggestions from '@theme/components/SearchBox/Suggestions'
    // import NavLinks from '@theme/components/NavLinks'
    import NavLink from '@theme/components/NavLink.vue'
    import Logotype from '@theme/components/Logotype'
    import SwitchLanguage from '@theme/components/SwitchLanguage'
    import searchMixin from '@theme/components/_mixins/search'

    export default {
	      mixins: [
	        searchMixin,
	      ],
        components: {
            WidthLimit,
            SidebarButton,
            // NavLinks,
            NavLink,
            SearchBox,
            Logotype,
            SwitchLanguage,
            Suggestions,
        },

        data() {
            return {
                currentLanguage: '',
            }
        },

        computed: {
            layoutWidth () {
                return this.$store.state.interface.layoutWidth;
            },
          isShowSearchResultWindow() {
            return this.$store.state.interface.isShowSearchResultWindow;
          },
        },

        watch: {
            $route(newValue) {
                this.currentLanguage = newValue.path;
            },
        },

        mounted() {
            this.currentLanguage = this.$page.path;
        },
    }

</script>

<style lang="stylus" module="$overallStyle">
    .searchBoxWrapper {
        /*height 40px*/
        height 100%
        position relative
        display flex
        align-items center
    }
    .searchBox {
        visibility visible
        height 40px
    }
    .searchSuggestionsWrapper {
        position absolute
        top 100%
        left 0
        width 100%
        margin-top 1px
    }
    .searchSuggestions {
        margin 0
    }
</style>
