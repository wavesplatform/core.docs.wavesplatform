<template>
    <!--:destroy-on-close="true"-->
    <!--:fullscreen="layoutWidth < 720"-->
    <el-dialog
        ref="dialogComponentExemplar"
        :class="$style.root"
        :visible="isShow"

        :modal="true"
        :show-close="false"
        :custom-class="$style.dialog"
        top=""
        @close="$emit('close')"
        :close-on-click-modal="false"
        @mousedown.native="rootMousedown"
        @mouseup.native="rootMouseup"
        :destroy-on-close="true"
    >
        <div :class="$style.root__header">
            <span
                :class="$style.closeTrigger"
                @click="$emit('close')"
            >
                <i :class="['el-icon-arrow-right', $style.closeTrigger__part, $style.closeTrigger__part1]"></i>
                <i :class="['el-icon-arrow-left', $style.closeTrigger__part, $style.closeTrigger__part2]"></i>
            </span>
        </div>
        <div :class="$style.root__body">
            <div :class="$style.stateIconWrapper">
                <img
                    src="./userimg-empty-80.svg"
                    :class="$style.stateIcon"
                    alt=""
                >
            </div>
            <h5 :class="$style.title">
                <!--NFT Tokens are not displayed-->
                {{$themeLocaleConfig.languageAbsenceNotification.title}}
            </h5>
            <p v-html="$themeLocaleConfig.languageAbsenceNotification.message" :class="$style.caption"/>

            <ButtonTrigger
                :class="$style.closeButton"
                @click.native="$emit('close')"
            >
                Ok
            </ButtonTrigger>
        </div>
    </el-dialog>
</template>

<script>
  import SearchBox from '@theme/components/SearchBox'
  import ButtonTrigger from '@theme/components/ButtonTrigger/'
  export default {
    components: {
      SearchBox,
        ButtonTrigger,
    },

    props: {
      isShow: {
        type: Boolean,
        default: false
      },
    },

    data () {
      const showMoreDisplayElementsOfOneStep = 10
      return {
        limitDisplaySearchResultNumber: showMoreDisplayElementsOfOneStep,
        showMoreDisplayElementsOfOneStep,
        isHideMoreButton: false,
        SearchBoxComponent: null,
        searchResult: [],
        currentSearchByQuery: '',
      }
    },

    computed: {
      query() {
        return this.$store.state.search.query;
      },
      currentSearchByQueryLength() {
        return this.currentSearchByQuery.length;
      },
      limitedDisplaySearchResult () {
        return this.searchResult.slice(0, this.limitDisplaySearchResultNumber)
      },
      layoutWidth () {
        return this.$store.state.interface.layoutWidth
      },
      i18nSearchPopupConfig() {
        return this.$themeLocaleConfig.searchPopup;
      },
      minQueryLength() {
        return this.i18nSearchPopupConfig.minQueryLength;
      },
    },

    watch: {
      // async isShow(isShow) {
      //
      // },
    },

    mounted () {

    },


    methods: {
      rootMousedown(event) {
        this.mouseenterElement = event.path[0];
      },

      rootMouseup(event) {
        if(this.$refs.dialogComponentExemplar.$el === this.mouseenterElement) {
          this.$emit('close');
        }
        this.mouseenterElement = null;
      },
    }
  }
</script>

<style lang="stylus">
    .dialog-fade-enter-active {
        animation: dialog-fade-in $transitionS2;
    }

    .dialog-fade-leave-active {
        animation: dialog-fade-out $transitionS1;
    }

    @keyframes dialog-fade-in {
        0% {
            transform: translate3d(0, -20px, 0);
            opacity: 0;
        }
        100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
    }

    @keyframes dialog-fade-out {
        0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
        }
        /*50% {
            transform: scale(.8);
            opacity: .7;
        }*/
        100% {
            transform: translate3d(0, -20px, 0) scale(.5);
            opacity: 0;
        }
    }
</style>

<style lang="stylus" module>
    .root {
        display flex
        flex-direction column
        height 100%
        overflow hidden
        position fixed
        justify-content center
        align-items center
        width 100vw
        /*overflow-y scroll*/
        :global(.el-dialog__header) {
            display none
        }
        :global(.el-dialog__body) {
            padding 0
            overflow: hidden;
            height: 100%;
            display flex
            flex-direction column
        }
    }
    .dialog {
        max-width 540px
        background-color var(--color2)
        /*max-height 850px*/
        /*height calc(100% - 40px)*/
        width calc(100% - 40px)
        margin auto
        border-radius 6px
        padding-bottom $indent3
        &:not(:global(.is-fullscreen)) {
            max-height 850px
        }
    }
    .root__header {
        padding-left $indent1
        padding-right $indent1
        display flex
        justify-content flex-end
        height 56px
        align-items center
    }
    .closeTrigger {
        cursor pointer
        transition transform $transitionS1
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
            transform rotate(180deg)
            .closeTrigger__part {
                color $color6
                /*transform rotate(360deg)*/
            }
        }
    }
    .closeTrigger__part {
        flex-shrink 0
        transition color $transitionS1, transform $transitionS1
        font-size 18px
        color var(--color9)
    }
    .closeTrigger__part1 {

    }
    .closeTrigger__part2 {
        margin-left -11px
    }
    .root__body {
        position relative
        display flex
        flex-direction column
        padding-left $indent9
        padding-right $indent9
    }
    .stateIconWrapper {
        /*max-height 80px*/
        display flex
        justify-content center
        position relative
        /*height 100%*/
        height 80px
        @media screen and (max-width: 719px) {
            /*max-height 50px*/
            height 50px
        }
    }
    .stateIcon {
        height 100%
    }
    .title {
        font-size: 22px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.27;
        letter-spacing: normal;
        text-align: center;
        margin-top $indent1
        color var(--color7)
    }
    .caption {
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.75;
        letter-spacing: normal;
        text-align: center;
        color var(--color8)
        margin-top $indent1
    }

    .closeButton {
        margin-top 40px
        font-size: 17px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        text-align: center;
        text-transform uppercase
        color: #fff
    }
</style>
