<template>
  <Content
      ref="root"
      class="pageContent"
  />
</template>

<script>
  import forPdfMixin from './_mixins/forPdf';
  export default {
    name: 'OnlyContent',
    mixins: [
      forPdfMixin,
    ],
    async mounted() {
      if(!this.$isServer) {
        // const rootElement = this.$refs.root.$el;
        // const imagesElements = [...rootElement.querySelectorAll('img')];
        // const imageElementLoadPromises = imagesElements.map((imageElement) => {
        //   if(!imageElement.complete) {
        //     return new Promise(resolve => {
        //       imageElement.onload = resolve;
        //     });
        //   }
        // });
        // await Promise.all(imageElementLoadPromises);
        console.log('this:', document.body.offsetHeight)
      }
    }
  }
</script>
<style>
  body {
    opacity: 1 !important;
  }
</style>
