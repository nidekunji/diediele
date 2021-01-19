/**
 * @author kunji
 * @description 单个的主题
 * @time 2020.5.31
 */
const {PAY_TYPE} = require('../Utils/Constants');

cc.Class({
    extends: cc.Component,

    properties: {
       
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
