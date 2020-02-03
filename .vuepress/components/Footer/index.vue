<template>
  <footer :class="$style.root">
      <WidthLimit :class="$style.root__widthLimit">
          <div
              :class="[$style.root__cell, $style.root__cell1]"
              :style="{
                width: root__cellWidth,
              }"
          >
              <a
                  :href="$store.getters.rootPagePath"
                  :class="$style.logotypeLink"
              >
                  <Logotype
                      :is-show-additional-text="false"
                      :class="$style.logotype"/>
              </a>
              <div
                  :class="$style.root__cell1__cell2"
                  v-html="footerI18n.broughtToYouByWavesTeam"
              />
              <div :class="$style.root__cell1__cell3">
                  {{ footerI18n.copyright }}
              </div>
              <div :class="$style.root__cell1__cell4">
                  <a :class="[$style.link, $style.mailto]"
                     :href="`mailto:${footerI18n.email}`">
                      {{ footerI18n.email }}
                  </a>
              </div>

              <SwitchLanguageType2 :class="$style.switchLanguage"/>
          </div>

          <div
              v-for="(resourcesCategoryI18n, resourcesCategoryI18nKey, resourcesCategoryI18nIndex) of resourcesCategoriesI18n"
              :key="resourcesCategoryI18nKey"
              :class="[
                $style.resourcesCategoryI18n,
                $style.root__cell,
                $style[`root__cell${resourcesCategoryI18nIndex + 2}`]
              ]"
              :style="{
                width: root__cellWidth,
              }"
          >
              <div :class="$style.resourcesCategoryI18n__wrapper">
                  <div :class="$style.categoryTitle">
                      {{resourcesCategoryI18n.title}}
                  </div>
                  <ul :class="$style.categoryLinks">
                      <li
                              v-for="(categoryLink, categoryLinkKey) of resourcesCategoryI18n.links"
                              :key="categoryLinkKey"
                              :class="$style.categoryLinkWrapper">
                          <a :class="[$style.link, $style.categoryLink]" :href="categoryLink.link" target="_blank">
                              {{categoryLink.title}}
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
      </WidthLimit>
  </footer>
</template>

<script>
  import WidthLimit from '@theme/components/WidthLimit'
  import Logotype from '@theme/components/Logotype'
  import SwitchLanguageType2 from '@theme/components/SwitchLanguage/Type2'
  export default {
    components: {
      WidthLimit,
      Logotype,
      SwitchLanguageType2,
    },

    computed: {
        themeLocaleConfig() {
            return this.$store.getters.themeLocaleConfig;
        },
      footerI18n() {
        return this.themeLocaleConfig.footer;
      },
      resourcesCategoriesI18n() {
        return this.footerI18n.resourcesCategories;
      },
        resourcesCategoriesI18nLength() {
          return Object.keys(this.resourcesCategoriesI18n).length;
        },
        root__cellWidth() {
          return 100/(this.resourcesCategoriesI18nLength + 1) + '%';
        },
    },
  }
</script>


<style lang="stylus" module>
    @import '~@themeExtend/components/Footer';
    $resourcesCategoryPadding-t-b = 20px
    $resourcesCategoryPadding-l-r = $indent1
    $resourcesCategoryPadding_min = 3px
    .link {
        transition $transitionS1
        &:hover {
            color var(--color7)
        }
    }
    .root {
        background-color var(--color3)
        margin-left (- $resourcesCategoryPadding-l-r)
        margin-right (- $resourcesCategoryPadding-l-r)
        padding 64px 0
        display flex
        justify-content center
        flex-wrap wrap
        align-items flex-start
        @media screen and (max-width: 719px) {
            padding 33px 0 64px 0
        }
    }
    .root__widthLimit {
        display flex
        align-items flex-start
        margin (- $resourcesCategoryPadding-t-b) 0
        flex-wrap wrap
        justify-content flex-start
        @media screen and (max-width: 679px) {
            flex-wrap wrap
        }
    }

    .root__cell {
        padding $resourcesCategoryPadding-t-b $resourcesCategoryPadding-l-r
        min-width 235px
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .root__cell1 {
        margin-bottom 40px
        /*margin-right 40px*/
        flex-shrink 0
    }

    .root__cell1__cell2,
    .root__cell1__cell3,
    .root__cell1__cell4,
    .mailto {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        color var(--color9)
    }
    .root__cell1__cell2 {
        margin-top 26px
        @media screen and (max-width: 375px) {
            margin-top: 32px;
        }
    }
    .root__cell1__cell3 {
        margin-top 10px
    }
    .root__cell1__cell4 {
        margin-top 19px
    }
    .switchLanguage {
        margin-top $indent4
    }
    .logotypeLink {
        display flex
        margin-top: -4px;
    }
    .logotype {
        /*width 100%*/
        max-width 164px
        height 100%
    }

    .resourcesCategoryI18n {
        /*width 220px*/
        &:not(:first-child) {
            /*margin-left 36px*/
        }
        @media screen and (max-width: 742px) {
            width calc(50% - 10px)
        }
        /*@media screen and (max-width: 679px) {
            padding $resourcesCategoryPadding-t-b $resourcesCategoryPadding_min
        }*/
        @media screen and (max-width: 320px) {
            width 110px
        }
    }
    .resourcesCategoryI18n_wrapper {

    }
    .categoryTitle {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        word-break: break-word;
        color var(--color14)
    }
    .categoryLinks {
        margin-top 29px
        @media screen and (max-width: 375px) {
            margin-top 21px
        }
    }
    .categoryLinkWrapper {
        word-break: break-all;
        &:not(:first-child) {
            margin-top 9px
            @media screen and (max-width: 375px) {
                margin-top 6px
            }
        }
    }
    .categoryLink {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        color var(--color9)
    }
</style>
