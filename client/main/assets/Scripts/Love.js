
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (window.userInfo) {
            this.node.getComponent(cc.Label).string = window.userInfo.love;
        }
    },
    
    
    start () {

    }
});
