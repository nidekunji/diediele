/**
 * @author kunji
 * @description 体力管理
 * @time 2020.5.28
 */
cc.Class({
    extends: cc.Component,

    properties: {
    },
    
   
    onLoad () {
        if (window.userInfo) {
            this.node.getComponent(cc.Label).string = window.userInfo.health;
        }
    },

    start () {

    },

    // update (dt) {},
});
