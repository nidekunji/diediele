/**
 * @author kunji
 * @description 排行榜
 * @time 2020.5.25
 */
cc.Class({
    extends: cc.Component,

    properties: {
        rankSprite: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on("show", () => {
            window.platform.showFriendRank();
        });
        this.node.on("hide", () => {
            window.platform.hideFriendRank();
        });
    },

    start () {

    },

    lateUpdate (dt) {
        if (window.platform) {
            if (typeof wx === "undefined") return;
            this.rankSprite.spriteFrame = new cc.SpriteFrame(window.platform.getOpenDataTexture());
        }
    }
});
