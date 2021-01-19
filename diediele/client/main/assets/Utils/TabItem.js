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
        normalLabel: cc.Texture2D,
        activeLabel: cc.Texture2D,
        normalBg: cc.Texture2D,
        activeBg: cc.Texture2D
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setActive () {
        this.node.getChildByName("label").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.activeLabel);
        this.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.activeBg);
    },

    setInactive () {
        this.node.getChildByName("label").getComponent(cc.Sprite).spriteFrame = this.normalLabel ? new cc.SpriteFrame(this.normalLabel) : null;
        this.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = this.normalBg ? new cc.SpriteFrame(this.normalBg): null;
    }

    // update (dt) {},
});
