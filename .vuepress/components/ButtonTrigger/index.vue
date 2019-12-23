<template>
	<div :class="$style.root">
		<slot/>
	</div>
</template>

<script>
	export default {

	}
</script>

<style lang="stylus" module>
	.root {
		width 100%
		background-color $color6
		padding $indent4 $indent1
		color var(--color7)
		display flex
		align-items center
		justify-content center
		border-radius $borderRadius1
		cursor pointer
	}
</style>
