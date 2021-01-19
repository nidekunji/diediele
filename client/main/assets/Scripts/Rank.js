/**
 * @author kunji
 * @description 排行榜
 * @time 2020.5.31
 */
cc.Class({
    extends: cc.Component,

    properties: {
        
        rankSprite: cc.Sprite
    },

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
        if (!Tools.isFromWx()){
            return;
        }
        if (window.platform) {
            this.rankSprite.spriteFrame = new cc.SpriteFrame(window.platform.getOpenDataTexture());
        }
    }
});
