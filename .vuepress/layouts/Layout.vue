<template>
    <div
        :class="$style.root"
    >
        <!--<template id="medium-zoom-template">
            <div>
                <header>My image zoom template</header>
                <div id="medium-zoom-container"></div>
                <aside>Comment on my image</aside>
            </div>
        </template>-->
        <div class="medium-zoom-container"></div>
        <template v-if="$page.path !== '/'">
            <!--<ThemeControl/>-->
            <SearchFrameContent/>
            <LanguageNotification
                :is-show="isShowLanguageNotification"
                @close="$store.commit('setDisplayShowLanguageNotification', false)"
            />
            <div :class="$style.navbarWrapper2">
                <WidthLimit
                    :type="2"
                    :class="$style.navbarWrapper"
                >
                    <!--@toggleSidebar="toggleLeftSidebar"-->
                    <Sidebar
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
                <Page
                    ref="page"
                    :sidebar-items="sidebarItems"
                    :class="['pageContent', $style.page]"
                />
                <PageNavigations
                    :sidebar-items="sidebarItems"
                    :class="$style.pageNavigations1"
                    :style="{
                    visibility: pageNavigationsTranslateY === 0 ? 'hidden' : ''
                }"
                />
            </WidthLimit>
            <PageNavigations
                ref="pageNavigations2"
                :sidebar-items="sidebarItems"
                :class="$style.pageNavigations2"
                :style="{
                paddingLeft: layoutWidth > 719 ? leftSidebarWidth + 'px' : '',
                paddingRight: isOpenRightSidebar ?
                rightSidebarWidth + 'px' :
                (layoutWidth > 719 ? rightSidebarAlwaysVisiblePartWidth + 'px' : 0),
                visibility: pageNavigationsTranslateY === 0 ? '' : 'hidden'
            }"
            />
        </template>
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
      name: 'Layout',
      mixins: [
          watchLayoutSizeMixin,
          navbarResizeDetectorMixin,
          searchMixin,
      ],

      components: {
          Page,
          Sidebar,
          Navbar,
          WidthLimit,
          PageNavigations,
          LanguageNotification,
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
                  paddingLeft: this.layoutWidth > 719 ? this.leftSidebarWidth + 'px' : '',

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
              this.computedAndSetMainContentPositionLeft();
              this.computedPageNavigationsTranslateY();
              if (newValue < 720) {
                  this.$store.commit('setDisplayRightSidebar', false);
                  this.$store.commit('setDisplayLeftSidebar', false);
              } else {
                  this.$store.commit('setDisplayLeftSidebar', true);
              }
          },
          layoutHeight() {
              this.computedPageNavigationsTranslateY();
          },
          leftSidebarWidth() {
              this.computedAndSetMainContentPositionLeft();
          },

          rightSidebarWidth() {
              this.computedAndSetMainContentPositionLeft();
          },

          isOpenRightSidebar() {
              this.computedAndSetMainContentPositionLeft();
          },

          isOpenLeftSidebar() {
              this.computedAndSetMainContentPositionLeft();
          },
          mainContentHeight() {
              this.computedPageNavigationsTranslateY();
          },
      },

      beforeMount() {
          if (!this.$isServer) {
              this.setRouterScrollBehavior();
          }
      },

      async mounted() {
          this._prepare();
          this.interval1 = null;
          if (this.layoutWidth > 719) {
              this.$store.commit('setDisplayLeftSidebar', true);
          }
          if (!this.$isServer) {
              this.pageNavigations2Element = this.$refs.pageNavigations2.$el;
              this.elementResizeDetector = this.$elementResizeDetectorMaker({
                  strategy: 'scroll'
              });
              window.addEventListener('scroll', this.windowScrollEventHandler);

              this.root__contentCellElement.addEventListener('transitionstart', this.transitionstartHandler, false);
              this.root__contentCellElement.addEventListener('transitionend', this.transitionendHandler, false);

              this.windowScrollEventHandler();
              this.computedAndSetMainContentPositionLeft();

              this.elementResizeDetector.listenTo(this.root__contentCellElement, this.setMainContentHeightInStore);

              this.computedPageNavigationsTranslateY();

              // const hash = this.$route.hash
              // await this.$nextTick();
              // this.scrollBehavior({hash});
          }
      },

      updated() {
          this._prepare();
      },

      beforeDestroy() {
          window.removeEventListener('scroll', this.windowScrollEventHandler);
          this.root__contentCellElement.removeEventListener('transitionstart', this.transitionstartHandler, false);
          this.root__contentCellElement.removeEventListener('transitionend', this.transitionendHandler, false);
          this.elementResizeDetector.removeListener(this.pageElement, this.setMainContentHeightInStore);
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

<style lang="stylus">
    .medium-zoom-container {
        position fixed
        z-index 2
        width 100vw
        height 100vh
        visibility hidden
    }
    .medium-zoom-overlay {
        z-index 1
    }
    .medium-zoom-image--opened {
        z-index 2
    }
</style>

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

</style>
