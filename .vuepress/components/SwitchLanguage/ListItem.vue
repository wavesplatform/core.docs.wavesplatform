<template>
    <component
        :is="tagName"
        :class="[
            $style.langListItem,
            languageItem.link === $page.path && $style.langListItem_active
        ]"
    >
        <div :class="$style.langListItem__cell1">
        <span v-html="languageItem.langIconRawSvg"
              :class="$style.langListItem__iconWrapper">
        </span>
            <span :class="$style.langListItem__title">
            {{languageItem.text}}
        </span>
        </div>
        <div
            :class="[$style.checkMark, $style.langListItem__cell2]"
        >
            <slot name="checkMark">
                <span :class="$style.checkMark__element"/>
            </slot>
        </div>
    </component>
</template>

<script>
  export default {
      props: {
          tagName: {
              type: String,
              default: 'li',
          },
          languageItem: {
              type: Object,
              required: true,
          }
      },
  }
</script>

<style lang="stylus" module>
    .langListItem {
        padding 12px 16px
        display flex
        align-items center
        justify-content space-between
        &:hover {
            background-color var(--color1)
        }
        &:not(.langListItem_active) {
            cursor pointer
            color var(--color7)
            .checkMark {
                opacity 0
            }
        }
    }
    .langListItem_active {
        cursor default
        color var(--color8)
        .checkMark {

        }
    }
    .langListItem__cell1 {
        display flex
    }
    .langListItem__cell2 {

      }
    .langListItem__iconWrapper {
        flex-shrink 0
        display flex
        align-items center
    }
    .langListItem__title {
        margin-left 8px
        flex-shrink 0
        height: 16px;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
    }
    .checkMark {
        transition $transitionS1
        width 12px
        display flex
        position relative
        margin-left 30px
        flex-shrink 0
        &:after {
            content: '';
            display: block;
            padding-bottom: 100%;
        }
    }
    .checkMark__element {
        margin-top -4px
        position absolute
        width 100%
        height 100%
        transform: rotate(45deg);
        &:before, &:after {
            content ''
            position absolute
            top 0
        }
        &:before {
            width 100%
            height 100%
            /*border-right 2px solid #f00*/
            box-shadow inset -2px 0 0 0 $color4
            left 0
        }
        &:after {
            width 50%
            height 100%
            box-shadow inset 0 -2px 0 0 $color4
            right 0
        }
    }
</style>
