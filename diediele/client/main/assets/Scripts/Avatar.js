/**
 * @author kunji
 * @description 头像
 * @time 2020.5.25
 */
cc.Class({
    extends: cc.Component,

    properties: {
       
        avatarUrl: cc.String
    },

    onLoad () {
        
    },

    start () {

    },

    setAvatarUrl (avatarUrl) {
        var self = this;
        this.avatarUrl = avatarUrl;
        cc.loader.load(avatarUrl, null, (err,img) => {
            if (err) {
                cc.error(err);
                return;
            }
            self.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
        });
    }

    // update (dt) {},
});
