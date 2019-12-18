<template>
  <div :class="$style.root">
    <div :class="$style.titlePage">
      <div :class="$style.titlePage__cell1">
        <Logotype :class="$style.logotype"/>
        <div :class="$style.titlePage__caption">
          <div :class="$style.titlePage__caption__part1">
            Platform Technical Description
            <br>
            Waves Exchange
          </div>
          <div :class="$style.titlePage__caption__part2">
            Master release
          </div>
        </div>

        <a
          href="https://docs.waves.exchange"
          target="_blank"
          :class="$style.siteLink"
        >
          https://docs.waves.exchange
        </a>

        <div :class="$style.pdfCreateDate">
          {{pdfCreateDate}}
        </div>
      </div>

    </div>
    <div :class="$style.framesWrapper">
      <iframe
              v-for="(frameScr, key) in frameScrList"
              :key="key"
              ref="frame"
              :src="frameScr + '?contentOnly=1'"
              :class="$style.frame"
              frameborder="0"
      />
    </div>
  </div>
</template>

<script>
  import Logotype from '@theme/components/Logotype'
  import forPdfMixin from './_mixins/forPdf'
  import { getFlatSidebarItems, resolveSidebarItems } from '../util'
  export default {
    name: 'ForPdf',
    mixins: [
      forPdfMixin,
    ],
    components: {
      Logotype
    },
    data() {
      return {
        // frameScrList: [
        //   '/en/waves-exchange-glossary',
        //   // '/en/waves-exchange/waves-exchange-security',
        //   // '/en/waves-keeper/getting-started-with-keeper',
        //   // '/en/waves-keeper/waves-keeper-api',
        // ],
        isMounted: false,
      }
    },
    computed: {
      sidebarItems() {
        return resolveSidebarItems(
                this.$page,
                this.$page.regularPath,
                this.$site,
                this.$localePath
        )
      },
      flatSidebarItems() {
        return getFlatSidebarItems(this.sidebarItems);
      },
      frameScrList() {
        return this.flatSidebarItems.map(sidebarItem => {
          let path = sidebarItem.path;
          if(sidebarItem.type === 'group' && path.slice(-1) !== '/') {
            path += '/'
          }
          return path;
        })/*.slice(0,4);*/
      },

      pdfCreateDate() {
        const date = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      },
    },

    methods: {

    },

    beforeCreate() {

    },

    async mounted() {
      if(!this.$isServer) {

        console.log('window.isViewReady:', window.isViewReady);

        const frameElements = this.$refs.frame;
        for (let index = 0; index < frameElements.length; index++) {
          const frameElement = frameElements[index];
          frameElement.onload = async() => {
            const frameWindow = frameElement.contentWindow;
            const frameDocument = frameWindow.document;
            const imagesElements = [...frameDocument.querySelectorAll('img')];
            for(let imageElementIndex = 0; imageElementIndex < imagesElements.length; imageElementIndex++) {
              const imageElement = imagesElements[imageElementIndex];
              // console.log('imageElement:', imageElement);
              if(!imageElement.complete) {
                await new Promise(resolve => {
                  imageElement.onload = resolve;
                });
              }
            }
            await frameWindow.vm.$nextTick();
            await new Promise(resolve => setTimeout(resolve, 0));

            frameElement.style.height = frameDocument.body.offsetHeight + 'px';
          };
        }
        window.isViewReady = true;
      }
    },
  }
</script>
<style>

</style>
<style lang="stylus" module>
    .root {
        display flex
        flex-direction column
        /*width 100vw
        height 100vh*/
        :global(.exchangeText) {
            fill: var(--color7) !important
        }
    }
    .titlePage {
      display flex
      flex-direction column
      height 29.7cm
      width 100%
      justify-content flex-start
      align-items flex-end
    }
    .titlePage__cell1 {
      display inline-flex
      flex-direction column
      align-items flex-end
      margin-top 100px
      border-top 2px solid var(--color7)
      padding 20px 0 0 10px
    }
    .logotype {
      width 700px
    }
    .titlePage__caption {
      margin-top 20px
      display flex
      flex-direction column
      align-items flex-end
    }
    .titlePage__caption__part1 {
      font-size 34px
      font-weight bold
    }
    .titlePage__caption__part2 {
      font-size 30px
      font-style italic
    }
    .siteLink {
      margin-top 100px
      font-size 20px
    }
    .pdfCreateDate {
      margin-top 100px
      font-size 20px
      font-weight bold
    }
    .framesWrapper {
      display flex
      flex-direction column
      flex-shrink 0
    }
    .frame {
      flex-shrink 0
      width 100vw
      overflow hidden
      &:not(:first-child) {
        margin-top 30px
      }
    }
</style>
