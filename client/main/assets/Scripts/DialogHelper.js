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
