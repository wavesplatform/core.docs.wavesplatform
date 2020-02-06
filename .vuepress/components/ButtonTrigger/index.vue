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
		/*width 100%*/
		background-color $color6
		padding $indent4 $indent1
		/*color var(--color7)*/
		color: #fff
		display flex
		align-items center
		justify-content center
		border-radius $borderRadius1
		cursor pointer

		font-size: 17px;
		font-weight: 500;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.29;
		letter-spacing: normal;
		text-align: center;
	}
</style>
