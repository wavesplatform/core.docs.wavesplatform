import WidthLimit from '@theme/components/WidthLimit'
import SearchBox from '@theme/components/SearchBox/'
import SidebarButton from '@theme/components/SidebarButton.vue'
// import NavLinks from '@theme/components/NavLinks'
import NavLink from '@theme/components/NavLink.vue'
import Logotype from '@theme/components/Logotype'
import SwitchLanguage from '@theme/components/SwitchLanguage'

export default {
    components: {
        WidthLimit,
        SidebarButton,
        // NavLinks,
        NavLink,
        SearchBox,
        Logotype,
        SwitchLanguage,
    },

    data() {
        return {
            linksWrapMaxWidth: null,
            currentLanguage: '',
        }
    },

    computed: {
        layoutWidth () {
            return this.$store.state.interface.layoutWidth;
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

    methods: {

    },
}
