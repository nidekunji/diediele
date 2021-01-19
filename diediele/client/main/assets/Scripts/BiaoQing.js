/**
 * @author kunji
 * @description 表情动画的播放
 * @time 2020.5.25
 */
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var anim = this.getComponent(cc.Animation);
        var animState = anim.play();
        // 使动画播放速度减速
        animState.speed = 0.5;
        // 设置循环模式为 Loop
        animState.wrapMode = cc.WrapMode.Loop;
    },

    start () {

    },

    // update (dt) {},
});
