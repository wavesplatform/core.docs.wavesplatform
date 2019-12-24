<template>
	<div
		ref="root"
		:class="[
			'note',
			$style.root,
			$style[`root_${type}`],
			withTitle && $style.root_withTitle,
		]">
		<div
			v-if="withTitle"
			:class="$style.title"
		>
			<component
				v-if="NoteIcon"
				:is="NoteIcon"
				:class="[$style.icon, $style.title__icon]"
				:type="type"
			/>
			<div :class="$style.title__container">
				<template v-if="title">
					{{title}}
				</template>
				<slot v-else name="title"/>
			</div>
		</div>

		<div :class="$style.content">
			<component
				v-if="NoteIcon && !withTitle"
				:is="NoteIcon"
				:class="[$style.icon, $style.content__icon]"
				:type="type"
			/>
			<div :class="$style.content__container">
				<template v-if="content">
					{{content}}
				</template>
				<slot v-else/>
			</div>
		</div>
	</div>
</template>

<script>
	import NoteIcon from './NoteIcon'

	export default {
	    name: 'Note',
		props: {
		  components: {
            NoteIcon,
		  },
		  type: {
		    type: String,
            validator(value) {
              return ['warning', 'tip', 'info', 'error'].includes(value);
            },
            default: 'info',
		  },
		  title: {
		    type: String,
		    default: '',
		  },
          content: {
		    type: String,
            default: '',
          },
		},
	    data() {
	      return {
            NoteIcon,
	        size: 1,
	      };
	    },

	    computed: {
	      withTitle() {
	        return this.title || this.$slots.title;
	      },
	    },

	    mounted() {
	      if(!this.$isServer) {
            this.elementResizeDetector = this.$elementResizeDetectorMaker({
              strategy: 'scroll'
            });
            // this.elementResizeDetector.listenTo(this.$refs.root, this.update);
	      }
	    },
	}
</script>

<style lang="stylus" module>
	.root {
		padding $indent1
		border-radius $borderRadius1
		border 1px dashed
		display flex
		flex-direction column
		font-size: 16px;
		font-weight: normal;
		font-stretch: normal;
		font-style: normal;
		line-height: normal;
		letter-spacing: normal;
		& + .root {
			margin-top $indent1
		}
	}
	.root_withTitle {

	}
	.root_warning {
		border-color var(--color15)
		.icon {
			color: var(--color15)
		}
		&:not(.root_withTitle) {
			.content__container {
				color: var(--color15)
			}
		}
	}
	.root_tip {
		border-color $color6
		.icon {
			color: $color6
		}
		.title__container {
			color: $color6
		}
		&:not(.root_withTitle) {
			.content__container {
				color: $color6
			}
		}
	}
	.root_info {
		border-color var(--color8)
		.icon {
			color: var(--color8)
		}
		.title__container {
			color: var(--color7)
		}
		&:not(.root_withTitle) {
			.content__container {
				color: var(--color7)
			}
		}
	}
	.root_error {
		border-color var(--color16)
		.icon {
			color: var(--color16)
		}
		.title__container {
			color: var(--color16)
		}
		&:not(.root_withTitle) {
			.content__container {
				color: var(--color16)
			}
		}
	}
	.icon {
		flex-shrink 0
		margin-right 12px
	}
	.title {
		display flex
		align-items center
		& + .content {
			margin-top 10px
		}
	}
	.title__icon {

	}
	.title__container {

	}
	.content {
		display flex
		line-height: 1.75;
		align-items flex-start
	}
	.content__icon {
		margin-top 8px
	}
	.content__container {
		color var(--color8)
	}
</style>
