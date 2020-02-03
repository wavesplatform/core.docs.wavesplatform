<template>
	<div>
		<div
			v-for="(versionValue, versionKey) in versions"
			:key="versionKey"
			:style="{
			  color: currentDocsVersionName === versionKey ? '#f00' : '',
			}"
			@click="changeDocsVersion(versionKey)"
		>
			{{versionValue.label}}
		</div>
	</div>
</template>

<script>
  export default {
    computed: {
      versions() {
        return Object.entries(this.$store.state.locales[this.$localePath]).reduce((accumulator, localeVersionEntry) => {
          const localeVersionKey = localeVersionEntry[0];
          const localeVersionValue = localeVersionEntry[1];
          if(localeVersionKey !== 'path') {
            accumulator[localeVersionKey] = localeVersionValue;
          }
          return accumulator;
        }, {});
      },
      currentDocsVersionName() {
        return this.$store.state.currentDocsVersionName;
      },
    },

    methods: {
      changeDocsVersion(versionKey) {
        this.$router.push(
          this.$page.path.replace(
            this.$localePath + this.currentDocsVersionName,
            this.$localePath + versionKey
          )
        );
        this.$store.commit('setCurrentDocsVersionName', versionKey);
      },
    },

  }
</script>

<style lang="stylus" module>

</style>
