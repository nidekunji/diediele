
cc.Class({
    extends: cc.Component,

    properties: {
        normalLabel: {
            type: cc.Texture2D,
            default: null,     
        },
        activeLabel: {
            type: cc.Texture2D,
            default: null,     
        },
        normalBg: {
            type: cc.Texture2D,
            default: null,     
        },
        activeBg: {
            type: cc.Texture2D,
            default: null,     
        },
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
