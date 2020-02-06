<template>
  <div
          :class="$style.root"
  >
    <template v-if="$page.path !== '/'">

      <!--<ThemeControl/>-->
      <SearchFrameContent/>
      <div :class="$style.navbarWrapper2">
        <WidthLimit
                :type="2"
                :class="$style.navbarWrapper"
        >
          <!--@toggleSidebar="toggleLeftSidebar"-->
          <Sidebar
                  v-if="layoutWidth > 719"
                  ref="sidebar1"
                  side="left"
                  :sidebar-toggle-trigger-options="{
                    isShow: layoutWidth > 719,
                }"
                  :items="sidebarItems"
                  :mod="layoutWidth > 719 ? 1 : 0"
                  :sidebar-min-width-px="leftSidebarMinWidthPxPrepare"
                  :is-resizable="layoutWidth > 719"
                  :options="{
                    isMobileMod: layoutWidth < 720,
                    isShowBodyPart: false,
                }"
                  :class="[
                        $style.sidebar,
                        $style.sidebar1,
                    ]"
          />
          <Navbar
                  ref="navbar"
                  :class="$style.navbar"
                  type="content"
                  :style="{
                        transform: (layoutWidth < 720 && isOpenLeftSidebar) ? `translateX(${leftSidebarWidth}px)` : '',
                    }"
                  :options="{
                    isShowSidebar: false,
                    logotypeJustifyContent: 'flex-start',
                  }"
          />
        </WidthLimit>
      </div>


      <WidthLimit
              ref="root__contentCell"
              :type="2"
              :class="[
                $style.root__contentCell,
            ]"
              :style="contentCellStyles"
              :padding-l-r="0"
      >
        <!--v-show="layoutWidth < 720"-->
        <WidthLimit
                v-show="layoutWidth < 720"
                :class="$style.searchBoxWrapper"
                :type="1"
                :padding-l-r="1"
        >
          <SearchBox
                  :class="$style.searchBox"
                  :is-full-size="true"
                  :size="1"
                  :with-suggestions="false"
                  @up="layoutWidth < 720 && suggestionsUp"
                  @down="layoutWidth < 720 && suggestionsDown"
                  @search="search"
          />
          <div
                  :class="$style.searchSuggestionsWrapper"
          >
            <Suggestions
                    ref="suggestions"
                    :class="$style.searchSuggestions"
            />
          </div>
        </WidthLimit>
        <div :class="$style.content">
          <Icon404 v-bind="{
            backgroundPathFill: activeColorationConfigColors.color3,
          }"/>
          <span :class="$style.content__title1">
            {{notFoundPageI18n.title}}
          </span>
          <span :class="$style.content__title2">
            {{notFoundPageI18n.description}}
          </span>
          <router-link
              :to="$localePath"
              :class="$style.backButtonLink"
          >
            <ButtonTrigger :class="$style.content__backButton">
              {{$themeLocaleConfig.backToIndexButtonText}}
            </ButtonTrigger>
          </router-link>
        </div>

      </WidthLimit>
    </template>
  </div>
</template>

<script>
  import Navbar from '@theme/components/Navbar'
  import Sidebar from '@theme/components/Sidebar/'
  import WidthLimit from '@theme/components/WidthLimit'
  import LanguageNotification from '@theme/components/LanguageNotification'
  import watchLayoutSizeMixin from './_mixins/watchLayoutSize'
  import navbarResizeDetectorMixin from './_mixins/navbarResizeDetector'
  import searchMixin from '@theme/components/_mixins/search'
  import { resolveSidebarItems, scrollToHashElement } from '../util'
  import ButtonTrigger from '@theme/components/ButtonTrigger/'

  import Icon404 from './404/Icon404'

  export default {
    name: 'NotFound',
    mixins: [
      watchLayoutSizeMixin,
      navbarResizeDetectorMixin,
      searchMixin,
    ],

    components: {
      Sidebar,
      Navbar,
      WidthLimit,
      LanguageNotification,
      Icon404,
      ButtonTrigger,
      // ThemeControl,
    },

    data() {
      return {
        sidebar1Mod: 1,
        sidebar2Mod: 2,
        rightSidebarMinWidthPx: 160,
        pageNavigationsTranslateY: 0,
        isShowPageNavigations2: false,
      }
    },

    computed: {
      activeColorationConfigColors() {
        return this.$store.getters.activeColorationConfigColors;
      },
      notFoundPageI18n() {
        return this.$themeLocaleConfig.notFoundPage;
      },
      isUserNaturalScrollState() {
        return this.$store.state.interface.isUserNaturalScrollState;
      },
      documentElementScrollTop() {
        return this.$store.state.interface.documentElementScrollTop;
      },
      isShowLanguageNotification() {
        return this.$store.state.isShowLanguageNotification;
      },
      rightSidebarAlwaysVisiblePartWidth() {
        return this.$store.state.interface.rightSidebarAlwaysVisiblePartWidth;
      },
      isRightSidebarResizingState() {
        return this.$store.state.interface.isRightSidebarResizingState;
      },
      isOpenRightSidebar() {
        return this.$store.state.interface.isOpenRightSidebar;
      },
      isOpenLeftSidebar() {
        return this.$store.state.interface.isOpenLeftSidebar;
      },
      leftSidebarWidth() {
        return this.$store.state.interface.leftSidebarWidth;
      },
      rightSidebarWidth() {
        return this.$store.state.interface.rightSidebarWidth;
      },
      leftSidebarMinWidthPx() {
        return this.$store.state.interface.leftSidebarMinWidthPx;
      },
      leftSidebarMinWidthPxPrepare() {
        return this.layoutWidth > 719 ? this.leftSidebarMinWidthPx : 260;
      },
      layoutHeight() {
        return this.$store.state.interface.layoutHeight;
      },
      mainContentHeight() {
        return this.$store.state.interface.mainContentHeight;
      },
      sidebarItems() {
        return resolveSidebarItems(
                this.$page,
                this.$page.regularPath,
                this.$site,
                this.$localePath
        )
      },
      contentCellStyles() {
        return {
          marginTop: this.headerHeight + 'px',

          transform: (this.layoutWidth < 720 && this.isOpenLeftSidebar) ? `translateX(${this.leftSidebarWidth}px)` : '',

          paddingRight: this.isOpenRightSidebar ?
                  this.rightSidebarWidth + 'px' :
                  (this.layoutWidth > 719 ? this.rightSidebarAlwaysVisiblePartWidth + 'px' : 0),

          transition: this.isRightSidebarResizingState ? 'initial' : '',
        }
      },
    },

    watch: {
      layoutWidth(newValue) {
        // this.computedAndSetMainContentPositionLeft();
        // this.computedPageNavigationsTranslateY();
        if (newValue < 720) {
          this.$store.commit('setDisplayRightSidebar', false);
          this.$store.commit('setDisplayLeftSidebar', false);
        } else {
          this.$store.commit('setDisplayLeftSidebar', true);
        }
      },
      // layoutHeight() {
      //   this.computedPageNavigationsTranslateY();
      // },
      // leftSidebarWidth() {
      //   this.computedAndSetMainContentPositionLeft();
      // },
      //
      // rightSidebarWidth() {
      //   this.computedAndSetMainContentPositionLeft();
      // },
      //
      // isOpenRightSidebar() {
      //   this.computedAndSetMainContentPositionLeft();
      // },
      //
      // isOpenLeftSidebar() {
      //   this.computedAndSetMainContentPositionLeft();
      // },
      // mainContentHeight() {
      //   this.computedPageNavigationsTranslateY();
      // },
    },

    beforeMount() {
      if (!this.$isServer) {
        this.setRouterScrollBehavior();
      }
    },

    async mounted() {
      // this._prepare();
      this.interval1 = null;
      if (this.layoutWidth > 719) {
        this.$store.commit('setDisplayLeftSidebar', true);
      }
      if (!this.$isServer) {


        // this.windowScrollEventHandler();
        // this.computedAndSetMainContentPositionLeft();


        // this.computedPageNavigationsTranslateY();

      }
    },

    updated() {
      // this._prepare();
    },

    beforeDestroy() {
      // window.removeEventListener('scroll', this.windowScrollEventHandler);
      // this.root__contentCellElement.removeEventListener('transitionstart', this.transitionstartHandler, false);
      // this.root__contentCellElement.removeEventListener('transitionend', this.transitionendHandler, false);
      // this.elementResizeDetector.removeListener(this.pageElement, this.setMainContentHeightInStore);
    },

    methods: {
      _prepare() {
        this.root__contentCellElement = this.$refs.root__contentCell.$el;
        this.pageElement = this.$refs.page.$el;
      },

      computedPageNavigationsTranslateY() {
        const heightDifference = this.mainContentHeight - this.layoutHeight - this.headerHeight + this.pageNavigations2Element.offsetHeight;
        if (heightDifference > 0) {
          this.pageNavigationsTranslateY = 0;
          return;
        }
        this.pageNavigationsTranslateY = -(this.layoutHeight - this.mainContentHeight - this.headerHeight) /*- this.documentElementScrollTop*/;
      },

      setMainContentHeightInStore(element) {
        this.$store.commit('setMainContentHeight', element.offsetHeight);
      },

      transitionstartHandler() {
        this.interval1 = setInterval(this.computedAndSetMainContentPositionLeft, 0);
      },

      transitionendHandler() {
        clearInterval(this.interval1);
      },

      async computedAndSetMainContentPositionLeft() {
        await this.$nextTick()
        this.$store.commit('setMainContentPositionLeft', this.pageElement.offsetLeft);
      },

      windowScrollEventHandler(event) {
        this.$store.commit('setDocumentElementScrollTop', document.documentElement.scrollTop);
      },

      setSidebarResizeDetector(sidebarRefName, pageContentPaddingSide, callback) {
        const element = this.$refs[sidebarRefName].$el
        const resizeFunction = () => {
          this[pageContentPaddingSide] = element.offsetWidth
          if (callback) {
            callback(element)
          }
        }
        this.elementResizeDetector.listenTo(element, resizeFunction)
        return resizeFunction
      },

      scrollBehavior(to, from, savedPosition) {
        if (this.isUserNaturalScrollState) {
          return
        }
        this.$store.commit('setScrollTopState', true);
        if (savedPosition) {
          return window.scrollTo({
            top: savedPosition.y,
            behavior: 'smooth',
          }, () => this.$store.commit('setScrollTopState', false))

        } else if (to.hash) {
          scrollToHashElement(to.hash, this.$store);
          return false;
        } else {
          return window.scrollTo({
            top: 0,
            behavior: 'smooth',
          }, () => this.$store.commit('setScrollTopState', false))
        }
      },

      setRouterScrollBehavior() {
        this.$router.options.scrollBehavior = this.scrollBehavior
      },
    }
  }
</script>

<style lang="stylus" module>
  .root {
    display flex
    flex-direction column
    height 100vh
    width 100vw
    overflow hidden
    align-items center
    min-height 100vh
  }
  .navbarWrapper2 {
    position fixed
    z-index 1
    justify-content: center;
    display: flex;
    width 100vw
  }
  .navbarWrapper {
    transform: translate3d(0, 0, 0);
    width: 100%;
    justify-content: center;
    position relative
    display flex
    z-index 1
    left 0
    top 0
  }
  .navbar {
    position fixed;
    /*left 0*/
    width 100vw
    flex-shrink 0
    z-index 1
    transition transform $transitionS1
  }
  .sidebar {
    font-size: 16px;
    background-color: var(--color11);
    z-index 2
    height 100vh
  }

  .sidebar1 {
    top 0
    left 0
    width 100%
    position fixed
  }



  .sidebar2 {
    right: 0;
    position absolute
    top 100%
    z-index 0
  }

  .root__cell2 {
    flex-shrink 0
    padding 15px 20px
    border-bottom 1px solid var(--borderColor)
  }

  .root__contentCell {
    display flex
    width 100%
    height 100%
    /*min-height 100vh*/
    justify-content flex-start
    transform translate3d(0, 0, 0);
    flex-direction column
    align-items center
    transition transform $transitionS1, padding-right $transitionS1
    padding-right 0
  }

  .searchBoxWrapper {
    position relative
    padding-top 20px
    padding-bottom 20px
    border-bottom 1px solid var(--borderColor)
    z-index 1
  }

  .searchBox {
    height 40px
  }

  .searchSuggestionsWrapper {
    position absolute
    top 100%
    left 0
    width 100%
  }

  .searchSuggestions {

  }

  .page {
    width 100%
    transition-duration $transitionS1
    padding-top: 23px;
  }
  .pageNavigations1 {
    position relative
    width 100%
  }

  .pageNavigations2 {
    position fixed
    bottom 0
    z-index 0
    transition transform $transitionS1
    will-change transform
  }


  .content {
    width 100%
    height 100%
    display flex
    flex-direction column
    justify-content center
    align-items center
  }
  .content__title1 {
    margin-top 24px
    font-size: 34px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
  }
  .content__title2 {
    margin-top 16px
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
  }
  .backButtonLink {
    display flex
  }
  .content__backButton {
    margin-top 44px
    min-width 208px
  }
</style>
