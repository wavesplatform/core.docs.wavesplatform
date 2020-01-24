<template>
	<div
			:class="[
        $style.sidebarGroup,
        $style[`depth${depth}`],
        isActiveItem && $style.sidebarGroup_active,
        collapsable && $style.sidebarGroup_collapsable,
        depth !== 0 && $style.sidebarGroup_isSubGroup,
    ]"
	>
	    <span
			    v-if="collapsable"
			    :class="[
		            $style.sidebarGroup__cell1,
		            $style.arrowIcon,
		            open ? 'el-icon-arrow-down' : 'el-icon-arrow-right',
		        ]"
			    @click="clickToggleTrigger"
	    />
		<div :class="$style.sidebarGroup__cell2">
			<template v-if="mod === 1 || mod === 0">
				<router-link
						v-if="item.path"
						:class="[
		                    $style.sidebarHeading,
		                    $style.sidebarHeading_clickable,
		                    open && $style.sidebarHeading_open,
		                    isActiveItem && $style.sidebarHeading_active,
		                    withActiveStateItem && $style.sidebarHeading_withActive,
		                ]"
						:to="item.path"
						@click.native.prevent.stop="clickOnLink($event)"
				>
                <span
		                :class="$style.sidebarHeading__title"
		                :data-text="item.title"
                >
                    {{ item.title }}
                </span>
				</router-link>
			</template>
			<DropdownTransition>
				<SidebarLinks
						:class="$style.sidebarGroupItems"
						:items="item.children"
						v-show="open || !collapsable"
						:sidebarDepth="item.sidebarDepth"
						:depth="depth + 1"
						:mod="mod"
				/>
			</DropdownTransition>
		</div>
	</div>
</template>

<script>
  import { normalize, getFlatSidebarItems } from '../util'
  import DropdownTransition from '@theme/components/DropdownTransition'
  import SidebarLinks from './SidebarLinks'

  export default {
    name: 'SidebarGroup',

    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      open: {
        type: Boolean,
        default: true
      },
      collapsable: {
        type: Boolean,
        default: true
      },
      depth: {
        type: Number,
        default: 1
      },
      mod: {
        type: Number,
        default: 0
      }
    },

    components: {
      DropdownTransition,
    },

    data() {
      return {
        isInsensitivity: true,
      };
    },

    computed: {
      normalizePagePath() {
        return normalize(this.$page.path);
      },
      isActiveItem() {
        return this.checkActiveState();
      },
      withActiveStateItem() {
          if (this.isActiveItem) {
              return false;
          }
          return this.flatChildrenItems.some(childrenItem => {
              return childrenItem.path === this.$page.path;
          });
      },
      leftSidebarOpenedGroups() {
        return this.$store.state.leftSidebarOpenedGroups;
      },
        flatChildrenItems() {
          return getFlatSidebarItems(this.item.children);
        },
    },

    watch: {
      isActiveItem(isActive) {
        if (isActive) {
          this.$emit('open');
        }
      },
      withActiveStateItem(withActiveItem) {
        if (withActiveItem) {
          this.$emit('open');
        }
      },
    },

    beforeCreate() {
      this.$options.components.SidebarLinks = SidebarLinks
    },

    mounted() {
      if (this.withActiveStateItem) {
        this.$emit('open');
      }
    },

    methods: {
      async clickOnLink() {
        this.$emit('open');
      },
      clickToggleTrigger() {
        if (this.open) {
          this.$emit('close');
          return;
        }
        this.$emit('open');
      },
      checkActiveState() {
        return this.normalizePagePath === normalize(this.item.path);
      },
    },

  }
</script>

<style lang="stylus" module>
	.sidebarGroup {
		display flex
		min-width 100%
		&:not(.sidebarGroup_collapsable) {

		}
	}

	.sidebarGroup_active {
		&:hover {
			& > .arrowIcon {
				color $color6
			}
		}
	}

	.sidebarGroup_collapsable {
		position relative
	}

	.sidebarGroup_isSubGroup {
		position relative
	}

	.sidebarGroup__cell1 {
		display flex
		margin-right 5px
		align-items flex-start
	}

	.arrowIcon {
		cursor pointer

		&:hover {
			color $color6
		}
	}

	.sidebarGroup__cell2 {
		display flex
		flex-direction column
		overflow hidden
		min-width 100%
	}

	.sidebarHeading {
		display: flex;
		align-items: baseline;
		transition color .15s ease
		width 100%
		margin 0
		font-size: 14px;
		font-weight: normal;
		font-stretch: normal;
		font-style: normal;
		line-height: normal;
		letter-spacing: normal;
		color var(--color12)
		min-width 100%
		&:not(.sidebarHeading_active) {
			cursor pointer

			&:hover {
				color $color6
			}
		}
	}

	.sidebarHeading_clickable {
		&:not(.sidebarHeading_active) {

		}

		&.sidebarHeading_active {
			font-weight 500
			color $color6
		}
	}

	.sidebarHeading_withActive {
		.sidebarHeading__title {
			&:before {
				font-weight 700
				color var(--color7)
			}
		}
	}

	.sidebarHeading_active {
		font-weight 500
		color $color6
	}

	.sidebarHeading_open {
		position relative
	}

	.sidebarHeading__title {
		text-overflow: ellipsis;
		white-space nowrap
		position relative
		visibility hidden

		&:before {
			content attr(data-text)
			position absolute
			top 0
			left 0
			visibility visible
		}
	}

	.sidebarGroupItems {
		transition height .1s ease-out
	}
</style>

