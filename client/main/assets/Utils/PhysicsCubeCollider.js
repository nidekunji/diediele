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
    extends: cc.PhysicsPolygonCollider,

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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.friction = 0.5;
        this.restitution = 0.2;
        this.points = [
            cc.v2({x: -92, y: 105}),
            cc.v2({x: -99, y: 101}),
            cc.v2({x: -105, y: 92}),
            cc.v2({x: -105, y: -92}),
            cc.v2({x: -101, y: -99}),
            cc.v2({x: -92, y: -105}),
            cc.v2({x: 92, y: -105}),
            cc.v2({x: 99, y: -101}),
            cc.v2({x: 105, y: -92}),
            cc.v2({x: 105, y: 92}),
            cc.v2({x: 101, y: 99}),
            cc.v2({x: 92, y: 105})
        ];
    },

    start () {

    },

    // update (dt) {},
});
