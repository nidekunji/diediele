/**
 * @author kunji
 * @description 主题列表
 * @time 2020.5.31
 */
const Service = require('../Utils/Service');
const UI = require('../Utils/UI');
const ThemeItem = require('./ThemeItem');
const {PROP_TYPE, PAY_TYPE, ERRORS} = require('../Utils/Constants');
const Prop = require('../Utils/Prop');

cc.Class({
    extends: cc.Component,

    properties: {
        themeItem: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.afterSettingInited = cc.game.on("setting inited", () => {
            this.loadThemes();
        });
        this.node.on("changed", (event) => {
            window.themeManager.setTheme(event.detail.theme.id);
            this.getComponent(cc.ScrollView).content.children.forEach((item) => {
                item.emit("currentThemeUpdate");
            });
        });
    },

    start () {
        this.loadThemes();
    },

    onDestroy () {
        cc.game.off("setting inited", this.afterSettingInited);
        cc.loader.releaseRes("theme item");
    },

    loadThemes () {
        if (!this.themesLoaded && window.themeManager) {
            var themes = window.themeManager.getAllThemes();
            console.log(themes, 'themes');
            Object.keys(themes).forEach((theme_id, index) => {
                this.loadThemeItem(themes[theme_id], index);
            });
            this.themesLoaded = true;
        }
    },

    loadThemeItem (theme, index) {
        console.log(theme, 'theme');
        var themeItemNode = cc.instantiate(this.themeItem);
        themeItemNode.on("click", () => {
            if (window.themeManager.currentThemeID == theme.id) {
                return;
            }
            if (theme.total == 0 || window.userInfo.themes.includes(theme.id)) {
                this.node.emit("changed", {theme: theme});
            } else {
                UI.showModal({
                    title: "提示",
                    content: "您是否要购买皮肤: " + theme.name,
                    showCancel: true,
                    success: () => {
                        Service.buyTheme(theme.id)
                        .then(() => {
                            switch(theme.paytype) {
                                case PAY_TYPE.GOLD_COIN : {
                                    Prop.consume(PROP_TYPE.GOLD_COIN, -theme.total);
                                    break;
                                }
                                case PAY_TYPE.LOVE : {
                                    Prop.consume(PROP_TYPE.LOVE, -theme.total);
                                    break;
                                }
                                default: break;
                            }
                            window.userInfo.themes.push(theme.id);
                            this.node.emit("changed", {theme: theme});
                        })
                        .catch((errmsg) => {
                            console.error(errmsg);
                            switch(errmsg) {
                                case ERRORS.SERVICEERR.ERR_LACK_OF_LOVE : {
                                    window.platform.showToast({
                                        title: "爱心数量不足",
                                        icon: "none"
                                    });
                                    break;
                                }
                                case ERRORS.SERVICEERR.ERR_LACK_OF_GOLDCOIN : {
                                    window.platform.showToast({
                                        title: "金币数量不足",
                                        icon: "none"
                                    });
                                    break;
                                }
                                default: {
                                    window.platform.showToast({
                                        title: "购买失败",
                                        icon: "none"
                                    })
                                    break;
                                }
                            }
                        });
                    }
                });
            }
        });
        var themeItemComponent = themeItemNode.getComponent(ThemeItem);
        themeItemComponent.setThemeData(theme);
        this.getComponent(cc.ScrollView).content.addChild(themeItemNode);
    }

    // update (dt) {},
});
