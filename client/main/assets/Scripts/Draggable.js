// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        draggable: {
            default: false,
            displayName: "可拖动",
            tooltip: "设置是否可拖拽使用",
           // type: cc.Boolean
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
