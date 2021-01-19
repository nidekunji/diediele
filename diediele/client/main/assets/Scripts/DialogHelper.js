/**
 * @author kunji
 * @description 好友帮助闯关
 * @time 2020.5.25
 */
cc.Class({
    extends: cc.Component,

    properties: {
        
        helperInfo: cc.Sprite,
        level: cc.Label
    },

    setData (data) {
        this.data = data;
        this.level.string = data.level;
        window.platform.showUserInfo(data.helper_openid);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
    },

    start () {

    },

    close () {
        this.node.destroy();
    },

    /**
     * 重新闯关
     */
    replay () {
        var currentScene = cc.director.getScene();
        if (currentScene.name == "Main") {
            var game = cc.find("Canvas", currentScene).getComponent("Game");
            game.level = this.data.level;
            game.restart();
            this.node.destroy();
        } else {
            window.level = this.data.level;
            cc.director.loadScene("Main");
        }
    },

    /**
     * 闯下一关
     */
    nextLevel () {
        var currentScene = cc.director.getScene();
        if (currentScene.name == "Main") {
            var game = cc.find("Canvas", currentScene).getComponent("Game");
            game.level = this.data.level + 1;
            game.restart();
            this.node.destroy();
        } else {
            window.level = this.data.level + 1;
            cc.director.loadScene("Main");
        }
    },

    update (dt) {
        
        this.helperInfo.spriteFrame = new cc.SpriteFrame(window.platform.getOpenDataTexture());
    },

    onDestroy () {
        window.platform.hideUserInfo();
        cc.loader.releaseRes("dialog_helper");
    }
});
