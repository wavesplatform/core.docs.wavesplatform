<template>
	<div
		ref="root"
		:class="[
			'note',
			$style.root,
			$style[`root_${type}`],
			withTitle && $style.root_withTitle,
			$style[`root_size${noteSize}`],
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
				:size="noteSize"
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
				:size="noteSize"
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
	        noteSize: 1,
	        switchSizePoint: 500,
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
            this.elementResizeDetector.listenTo(this.$refs.root, this.setNoteSize);
	      }
	    },

	    methods: {
	      setNoteSize(element) {
	        if(element.offsetWidth > this.switchSizePoint) {
	          this.noteSize = 1;
	          return
	        }
            this.noteSize = 2;
	      },
	    },
	}
</script>

<style lang="stylus" module>
	.root {
		border-radius $borderRadius1
		border 1px dashed
		display flex
		flex-direction column
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
	.root_size1 {
		font-size 16px
		padding $indent1
		.content__icon {
			margin-top 8px
		}
	}
	.root_size2 {
		font-size 14px
		padding $indent4
		.content__icon {
			margin-top 6px
		}
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
	}
	.content__container {
		color var(--color8)
	}
</style>
