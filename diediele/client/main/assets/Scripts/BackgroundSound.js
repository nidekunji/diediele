/**
 * @author kunji
 * @description 背景音乐
 * @time 2020.5.25
 */
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        cc.loader.loadRes("music/background", (error, resource) => {
            if (error) {
                cc.error("error when loadRes `music/background`", error);
                return;
            }
            // 播放背景音乐
            this.bgAudioID = cc.audioEngine.play(resource, true, 1);
        });
    },

    onDestroy () {
        // 关闭背景音乐
        //cc.audioEngine.stop(this.bgAudioID);
    },

    start () {

    },

    // update (dt) {},
});
