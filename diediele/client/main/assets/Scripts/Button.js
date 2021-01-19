/**
 * @author kunji
 * @description 通用按钮点击
 * @time 2020.5.25
 */
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END, function(e) {
            cc.game.emit("button press");
        });
    },

    start () {

    },

    // update (dt) {},
});
