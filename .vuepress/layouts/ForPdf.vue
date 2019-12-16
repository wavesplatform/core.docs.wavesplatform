<template>
  <div :class="$style.root">
    <Logotype :class="$style.logotype"/>
    Title page content
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
        frameScrList: [
          '/en/waves-exchange-glossary',
          '/en/waves-exchange/waves-exchange-security',
          '/en/waves-keeper/getting-started-with-keeper',
          '/en/waves-keeper/waves-keeper-api',
        ],
        isMounted: false,
      }
    },

    methods: {

    },

    beforeCreate() {

    },

    async mounted() {
      const frameElements = this.$refs.frame;
      for (let index = 0; index < frameElements.length; index++) {
        const frameElement = frameElements[index];
        frameElement.onload = async() => {
          const frameWindow = frameElement.contentWindow;
          const frameDocument = frameWindow.document;
          // const imagesElements = [...frameDocument.querySelectorAll('img')];
          // for(let imageElementIndex = 0; imageElementIndex < imagesElements.length; imageElementIndex++) {
          //   const imageElement = imagesElements[imageElementIndex];
          //   console.log('imageElement:', imageElement);
          //   if(!imageElement.complete) {
          //     await new Promise(resolve => {
          //       imageElement.onload = resolve;
          //     });
          //   }
          // }
          await frameWindow.vm.$nextTick();
          // await new Promise(resolve => setTimeout(resolve, 0));

          console.log('document.readyState 1:', frameDocument.body.offsetHeight, frameWindow.vm._isMounted)

          // setInterval(() => {
          //   console.log('document.readyState:', frameDocument.body.offsetHeight, frameWindow.vm._isMounted)
          // }, 1000);

          frameElement.style.height = frameDocument.body.offsetHeight + 'px';
        };
      }
      // this.isMounted = true;
    },
  }
</script>
<style>
  body {
    opacity: 1 !important;
  }
</style>
<style lang="stylus" module>
    .root {
        display flex
        flex-direction column
        /*width 100vw
        height 100vh*/
    }
    .logotype {
      max-width 500px
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
    }
</style>
