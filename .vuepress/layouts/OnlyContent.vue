<template>
  <Content class="pageContent"/>
</template>

<script>
  import forPdfMixin from './_mixins/forPdf';
  export default {
    name: 'OnlyContent',
    mixins: [
      forPdfMixin,
    ],
    mounted() {
      console.log('this:')
    }
  }
</script>
<style>
  body {
    opacity: 1 !important;
  }
</style>
