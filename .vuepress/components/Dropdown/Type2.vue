<template>
    <div
        ref="root"
        :class="$style.root"
        :style="{
            height: currentLangElementHeight + 'px',
        }"
    >
        {{versions}}
        <div :class="$style.root__wrapper">
            <div
                :class="[$style.langListCard, isShowLangList && $style.langListCard_isShow]"
            >
                <ul :class="$style.langList">
                    <ListItem
                        v-for="(languageItem, index) in languageNavDropdown"
                        v-if="languageItem.link !== $page.path"
                        :key="index"
                        v-bind="{
                            languageItem,
                        }"
                        :class="$style.langList__item"
                        @click.native="selectLanguage(languageItem)"
                    />
                </ul>
            </div>
            <ListItem
                    ref="currentLang"
                    tag-name="div"
                    v-bind="{
                        languageItem: activeLanguageItem,
                    }"
                    :class="$style.currentLang"
                    @click.native="toggleLangList"
            >
                <i
                    slot="checkMark"
                    :class="[
                        'el-icon-arrow-left',
                        $style.checkMark,
                        isShowLangList && $style.checkMark_inverted
                    ]"/>
            </ListItem>
        </div>
    </div>
</template>

<script>
    import mixin from './_mixins'
    export default {
        mixins: [
            mixin
        ],
        data() {
          return {
              currentLangElementHeight: 0,
          };
        },
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

            activeLanguageItem() {
                return this.languageNavDropdown.filter(languageItem => {
                    return languageItem.link === this.$page.path;
                })[0];
            },

        },
        mounted() {
            if(!this.$isServer) {
                console.log('versions:', this.versions, this.languageNavDropdown)
                this.currentLangElement = this.$refs.currentLang.$el;
                this.elementResizeDetector = this.$elementResizeDetectorMaker({
                    strategy: 'scroll'
                });

                this.elementResizeDetector.listenTo(this.currentLangElement, this.currentLangElementHeightHandler);

                this.currentLangElementHeightHandler(this.currentLangElement);
            }
        },
        methods: {
          currentLangElementHeightHandler(element) {
              this.currentLangElementHeight = element.offsetHeight;
          },
        },
    }
</script>

<style lang="stylus" module>
    .root {
        display flex
        position relative
        align-items flex-end
    }
    .root__wrapper {
        border 1px solid var(--borderColor2)
        display flex
        flex-direction column
        border-radius 4px
        overflow hidden
        flex-shrink 0

    }
    .currentLang {
        flex-shrink 0
        cursor pointer
    }
    .checkMark {
        transition transform $transitionS1
        transform rotate(-90deg)
    }
    .checkMark_inverted {
        transform rotate(90deg)
    }
    .langListCard {
        flex-shrink 0
        transition .3
        background-color var(--color13)
        overflow hidden
        &:not(.langListCard_isShow) {
            max-height 0
        }
    }
    .langList {
    }
    .langList__item {
        background-color var(--color3)
    }
</style>
