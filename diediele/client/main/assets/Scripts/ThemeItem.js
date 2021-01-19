// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const {PAY_TYPE} = require('../Utils/Constants');

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
        thumb: cc.Sprite,
        title: cc.Label,
        used: cc.Node,
        had: cc.Node,
        price: cc.Node,
        border: cc.Node,
        theme: {
            get () {
                return this._theme;
            },
            set (value) {
                this._theme = value;
            }
        }
    },

    loadImage(sprite,url){
        window.platform.loadImage(sprite,url);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on("currentThemeUpdate", () => {
            this.resetStatus();
            this.updateStatus();
        });
    },

    start () {

    },

    resetStatus() {
        this.border.active = false;
        this.had.active = false;
        this.used.active = false;
        this.price.active = false;
    },

    updateStatus() {
        var theme = this.theme;
        if (window.userInfo.themes.includes(theme.id)) {
            if (theme.id == window.themeManager.currentThemeID) {
                this.used.active = true;
                this.border.active = true;
            } else {
                this.had.active = true;
            }
        } else {
            if (theme.total > 0) {
                this.price.active = true;
            } else {
                if (theme.id == window.themeManager.currentThemeID) {
                    this.used.active = true;
                    this.border.active = true;
                } else {
                    this.had.active = true;
                }
            }
        }
    },

    setThemeData(theme) {
        this.theme = theme;
        this.title.string = theme.name;
        this.loadImage(this.thumb, theme.thumb);
        switch(theme.paytype) {
            case PAY_TYPE.GOLD_COIN : {
                this.price.getChildByName("gold").active = true;
                break;
            }
            case PAY_TYPE.LOVE : {
                this.price.getChildByName("love").active = true;
                break;
            }
            default: break;
        }
        this.price.getChildByName("total").getComponent(cc.Label).string = theme.total;
        this.updateStatus();
    }

    // update (dt) {},
});
