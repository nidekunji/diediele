
cc.Class({
    extends: cc.Component,

    properties: {
       
        draggable: {
            default: false,
            displayName: "可拖动",
            tooltip: "设置是否可拖拽使用",
            type: cc.Boolean
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.draggable) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                var delta = event.touch.getDelta();
                this.x += delta.x;
                this.y += delta.y;
            }, this.node);
        }
    },

    start () {

    },

    // update (dt) {},
});
