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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var anim = this.getComponent(cc.Animation);
        var animState = anim.play();
        // 使动画播放速度减速
        animState.speed = 0.5;
        // 设置循环模式为 Loop
        animState.wrapMode = cc.WrapMode.Loop;
        setTimeout(() => {
            this.node.parent.getChildByName("wave").runAction(
                cc.repeatForever(cc.sequence(cc.spawn(cc.scaleBy(1, 2, 2), cc.fadeTo(1, 0)), cc.spawn(cc.scaleBy(0, 0.5, 0.5), cc.fadeTo(0, 255))))
            );
        }, 500);
    },

    // update (dt) {},
});
