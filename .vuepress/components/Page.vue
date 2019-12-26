<template>
    <WidthLimit
        ref="root"
        :class="$style.root"
        :padding-l-r="layoutWidth > 719 ? 3 : 1"
    >
      <main
          :class="$style.page"
      >
        <slot name="top"/>
        <div :class="$style.page__header">
          <div
              ref="editLink"
              :class="$style.editLinkWrapper"
                v-if="editLink"
          >
            <a
                :class="$style.editLink"
              :href="editLink"
              target="_blank"
              rel="noopener noreferrer"
            >
                <el-button
                    size="small"
                    :class="$style.editButton"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                        <g fill="none" fill-rule="evenodd">
                            <!--<path fill="#f00" d="M27.733 0A4.267 4.267 0 0 1 32 4.267v23.466A4.267 4.267 0 0 1 27.733 32H4.267A4.267 4.267 0 0 1 0 27.733V4.267A4.267 4.267 0 0 1 4.267 0h23.466zm0 1.067H4.267a3.2 3.2 0 0 0-3.2 3.2v23.466a3.2 3.2 0 0 0 3.2 3.2h23.466a3.2 3.2 0 0 0 3.2-3.2V4.267a3.2 3.2 0 0 0-3.2-3.2z"/>-->
                            <path fill="#9BA6B2" fill-rule="nonzero" d="M17.82 11.026l3.037 3.052-7.69 7.727-3.035-3.052 7.687-7.727zm5.342-.737l-1.355-1.361a1.34 1.34 0 0 0-1.899 0l-1.297 1.304 3.037 3.053 1.514-1.521a1.044 1.044 0 0 0 0-1.475zM8.542 23.043c-.055.25.17.474.418.414l3.385-.825-3.036-3.053-.767 3.464z"/>
                        </g>
                    </svg>
                </el-button>
            </a>
          </div>
        </div>
        <Content
            ref="content"
            :class="['pageContent', editLink && 'withEditLink']"
        />
      </main>
    </WidthLimit>
</template>

<script>
  import mediumZoom from 'medium-zoom'
  import WidthLimit from '@theme/components/WidthLimit'
  import { outboundRE, endingSlashRE, scrollToHashElement } from '../util'
  export default {
    components: {
      WidthLimit,
    },

    props: [
      'sidebarItems'
    ],

    data() {
      return {
        pageNavigationsTranslateY: 0,
        headersElements: [],
        mediumZoomInitOnPagePath: '',
        // intersectionObserverOptions: {
        //     threshold: 0.0,
        //     rootMargin: '0% 0px',
        // },
      }
    },

    computed: {
      activeColorationConfigColors() {
        return this.$store.getters.activeColorationConfigColors;
      },
      isScrollTopState() {
        return this.$store.state.interface.isScrollTopState;
      },
      documentElementScrollTop() {
        return this.$store.state.interface.documentElementScrollTop;
      },
      mainContentHeight() {
        return this.$store.state.interface.mainContentHeight;
      },
      layoutHeight() {
        return this.$store.state.interface.layoutHeight;
      },
      layoutWidth() {
        return this.$store.state.interface.layoutWidth;
      },
      headerHeight () {
        return this.$store.state.interface.headerHeight;
      },
      lastUpdated () {
        return this.$page.lastUpdated
      },
      // lastUpdatedText () {
      //   if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
      //     return this.$themeLocaleConfig.lastUpdated
      //   }
      //   if (typeof this.$site.themeConfig.lastUpdated === 'string') {
      //     return this.$site.themeConfig.lastUpdated
      //   }
      //   return 'Last Updated'
      // },

      editLink () {
        const {
          repo,
          docsDir = '',
          docsBranch = 'master',
          docsRepo = repo
        } = this.$themeConfig;

        if(!docsRepo) {
            return false;
        }

          return docsRepo.replace(endingSlashRE, '')
              + `/edit`
              + `/${docsBranch}/`
              + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
              + this.$page.relativePath;
      },

      // editLinkText () {
      //   return (
      //     this.$themeLocaleConfig.editLinkText
      //     || this.$site.themeConfig.editLinkText
      //     || 'Edit'
      //   )
      // }
    },

      watch: {
          // '$route.hash'(newValue) {
          //     console.log('newValue:', newValue);
          // },
          // documentElementScrollTop() {
          //     this.setCurrentActiveHeaderId();
          // },
          mainContentHeight() {
              this.setCurrentActiveHeaderId();
          },
          '$page.path'() {
              this.updateHeadersElements();
              this.attachToMediumZoom();
          },
      },

    async mounted () {
        if (!this.$isServer) {
            vm.pageContentElement = this.$refs.root.$el;
            vm.editLinkElement = this.$refs.editLink;
            this.updateHeadersElements();
            this.mediumZoomInstance = mediumZoom({
                margin: 20,
                background: this.activeColorationConfigColors.color7_alpha1,
                scrollOffset: 0,
                container: '.medium-zoom-container',
                // template: '.medium-zoom-template',
            });
            this.attachToMediumZoom();

            await this.$nextTick();
            await new Promise(resolve => setTimeout(resolve, 0));

            await this.awaitLoadContentImages();

            if(document.documentElement.scrollTop === 0) {
                scrollToHashElement(this.$route.hash, this.$store);
            }
            await this.$nextTick();
            this.$watch('documentElementScrollTop', () => {
                this.setCurrentActiveHeaderId();
            });
        }
    },

    updated () {
      if (!this.$isServer) {
        this.updateHeadersElements();
        this.attachToMediumZoom();
      }
    },

    methods: {
        async awaitLoadContentImages(imageLoadCallback) {
            const imagesElements = [...this.$refs.content.$el.querySelectorAll('img')];
            for(const imageElement of imagesElements) {
                if(!imageElement.complete) {
                    await new Promise(resolve => {
                        imageElement.onload = resolve;
                    });
                }
                imageLoadCallback && imageLoadCallback(imageElement);
            }
        },
      async attachToMediumZoom() {
          await this.$nextTick();
          if(this.$page.path === this.mediumZoomInitOnPagePath) {
              return;
          }
          this.mediumZoomInitOnPagePath = this.$page.path;
          this.mediumZoomInstance.detach();
          const imagesElements = [...this.$refs.content.$el.querySelectorAll('img')];
          const imagesWithZoom = [];

          await this.awaitLoadContentImages((imageElement) => {
              if(
                      imageElement.width < imageElement.naturalWidth
                      ||
                      imageElement.height < imageElement.naturalHeight
              ) {
                  imagesWithZoom.push(imageElement);
              }
          });
          this.mediumZoomInstance.attach(...imagesWithZoom);
      },
      setCurrentActiveHeaderId() {
        if(this.isScrollTopState) {
          return;
        }
        const currentActiveHeaderId = this.getCurrentActiveHeaderId();
        if(!currentActiveHeaderId) {
          return;
        }
        if(decodeURIComponent(this.$route.hash).slice(1) !== currentActiveHeaderId) {
          this.$store.commit('setUserNaturalScrollState', true);
          this.$router.push({hash: currentActiveHeaderId})
          setTimeout(() => this.$store.commit('setUserNaturalScrollState', false), 0)
        }
      },

      getCurrentActiveHeaderId() {
        const idsValues = this.headersElements.reduce((accumulator, headerElement) => {
          let value = headerElement.offsetTop - this.documentElementScrollTop + this.headerHeight - headerElement.offsetHeight;

          // if(value < 0) {
          //   value = value * -1;
          // }
          // accumulator[headerElement.id] = value;

          if(value < 0) {
            accumulator[headerElement.id] = value;
          }
          return accumulator;
        }, {});

        const values = Object.values(idsValues);
        const keys = Object.keys(idsValues);
        const minValue = Math.max(...values);
        const minValueIndex = values.indexOf(minValue);
        return keys[minValueIndex];
      },

      updateHeadersElements () {
        let headers = this.$page.headers;
        let sidebarDepth = this.$frontmatter.sidebarDepth || 1;

        // this.headersElements.forEach(headersElement => {
        //   this.interactionObserver.unobserve(headersElement);
        // });
        if (!headers || !headers.length) {
          return
        }
        headers = headers.filter(header => {
          return header.level <= sidebarDepth + 1;
        });
        this.headersElements = headers.reduce((accumulator, header) => {
            const element = document.querySelector(`#${header.slug}`);
            if(element) {
                accumulator.push(element);
            }
          return accumulator;
        }, []);
      },

    }
  }
</script>

<style lang="stylus" module>
    @import '~@themeExtend/components/Page';

    .root {
        padding-top $indent1
        /*padding-bottom $indent4*/
        padding-bottom $indent1
    }
    .page {
        display block
        position relative

    }
    .page__header {
        width 100%
        display flex
        justify-content flex-end

        a {
            color lighten($textColor, 25%)
        }
    }
    .editLinkWrapper {
        display flex
        width 100%
        visibility hidden
        justify-content flex-end
        position absolute
        top 0
        left 0
        margin-top: 4px;
    }
    .editLink {
        visibility visible
        display flex
    }
    .editButton {
        padding 0
        /*background-color var(--color11)*/
        background-color transparent
        &:hover {
            background-color transparent
            border-color $color6
        }
        & > * {
            display flex
        }
    }
</style>

