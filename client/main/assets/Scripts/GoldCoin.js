/**
 * @author kunji
 * @description 金币
 * @time 2020.5.28
 */
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (window.userInfo) {
            this.node.getComponent(cc.Label).string = window.userInfo.goldcoin;
        }
    },

    start () {

    }
});
