<template>
    <div
        ref="root"
        :class="$style.root">
        <div
            :class="$style.currentLangIconWrapper"
            v-html="$themeLocaleConfig.langIconRawSvg"
            @click="toggleLangList"
        ></div>

        <el-card
            :class="[$style.langListCard, isShowLangList && $style.langListCard_isShow]"
            :body-style="{
                padding: 0
            }"
        >
            <ul :class="$style.langList">
                <!--<li
                    v-for="(languageItem, index) in languageNavDropdown.items"
                    :key="index"
                    :class="[
                    $style.langList__item,
                    languageItem.link === $page.path && $style.langList__item_active
                ]"
                    @click="selectLanguage(languageItem)"
                >
                    <div :class="$style.langList__item__cell1">
                        <span v-html="languageItem.langIconRawSvg"
                              :class="$style.langList__item__iconWrapper">
                        </span>
                        <span :class="$style.langList__title">
                            {{languageItem.text}}
                        </span>
                    </div>

                    <div
                        :class="[$style.checkMark, $style.langList__item__cell2]"
                    >
                        <span :class="$style.checkMark__element"/>
                    </div>
                </li>-->
                <ListItem
                        v-for="(languageItem, index) in languageNavDropdown.items"
                        :key="index"
                        v-bind="{
                            languageItem,
                        }"
                        :class="$style.langList__item"
                        @click.native="selectLanguage(languageItem)"
                />
            </ul>
        </el-card>

    </div>
</template>

<script>
    import mixin from './_mixins'
    export default {
        mixins: [
            mixin
        ],
    }
</script>

<style lang="stylus" module>
    .root {
        display flex
        position relative
    }
    .currentLangIconWrapper {
        cursor pointer
        display flex
    }
    .langListCard {
        position absolute
        top 100%
        right 0
        transition .3
        margin-top 40px
        background-color var(--color13)
        &:not(.langListCard_isShow) {
            visibility hidden
            opacity 0
        }
    }
    .langList {
        margin 5px 0
    }
    .langList__item {
        padding 12px 16px
        display flex
        align-items center
        justify-content space-between
        &:hover {
            background-color var(--color1)
        }
        &:not(.langList__item_active) {
            cursor pointer
            color var(--color7)
            .checkMark {
                opacity 0
            }
        }
    }
    .langList__item_active {
        cursor default
        color var(--color8)
        .checkMark {

        }
    }
    .langList__item__cell1 {
        display flex
    }
    .langList__item__cell2 {

      }
    .langList__item__iconWrapper {
        flex-shrink 0
        display flex
        align-items center
    }
    .langList__title {
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
