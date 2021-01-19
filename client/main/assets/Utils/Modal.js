/**
 * @author kunji
 * @description 按钮点击动画
 * @time 2020.5.31
 */
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.setScale(0, 0);
    },

    start () {
      //  this.node.active = false;
    },

    show () {
        this.node.active = true;
        this.node.emit("show");
        this.node.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
    },

    hide () {
        this.node.setScale(0, 0);
        this.node.emit("hide");
        this.node.active = false;
    }

    // update (dt) {},
});
