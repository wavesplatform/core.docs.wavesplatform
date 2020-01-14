import elementResizeDetectorMaker from 'element-resize-detector'

export default (context) => {
    const { Vue, isServer } = context;

    if (!isServer) {
        Vue.prototype.$elementResizeDetectorMaker = elementResizeDetectorMaker;
        // Vue.prototype.$elementResizeDetector = elementResizeDetectorMaker({
        //     strategy: 'scroll'
        // });
    }
}
