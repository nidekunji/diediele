/**
 * @author kunji
 * @description 选择关卡
 * @time 2020.5.27
 */
const {ERRORS, GAME_EVENTS,HP_TYPE, PROP_TYPE} = require('../Utils/Constants');
var Service = require('../Utils/Service');
var Prop = require('../Utils/Prop');
const UI = require('../Utils/UI');

cc.Class({
    extends: cc.Component,

    properties: {
        pageLevel: {
            default: null,
            type: cc.Prefab
        },
        btnLevel: {
            default: null,
            type: cc.Prefab
        },
        bgLocked: {
            default: null,
            type: cc.SpriteFrame
        },
        bgNormal: {
            default: null,
            type: cc.SpriteFrame
        },
        pageSize: {
            default: 30,
            type: cc.Float,
            tooltip: "每个页面显示多少个关卡"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pageView = this.getComponent(cc.PageView);
    },

    start () {
        var self = this;
        console.log(window.setting.levelCount, 'setting.levelcount');
        if (window.setting && window.setting.levelCount) {
            var pageSize = this.pageSize;
            var pageCount = Math.ceil(window.setting.levelCount / this.pageSize);
            var addPage = function() {
                var newPage = cc.instantiate(self.pageLevel);
                self.pageView.addPage(newPage);
            }
            var setPageContent = function(pageIndex) {
                var page = self.pageView.getPages()[pageIndex];
                if (page.isLoaded) {
                    return;
                }
                var grid = page.getChildByName("grid");
                var pageMinLevel = pageIndex * pageSize + 1;
                var pageMaxLevel = 0;
                if (pageIndex == pageCount -1) {
                    pageMaxLevel = window.setting.levelCount;
                } else {
                    pageMaxLevel = (pageIndex + 1) * pageSize;
                }
                for (var level = pageMinLevel; level <= pageMaxLevel; level++) {
                    var button = cc.instantiate(self.btnLevel);
                    button.level = level;
                    if (window.userInfo.level >= level - 1) {
                        button.getComponent(cc.Sprite).spriteFrame = self.bgNormal;
                    } else {
                        button.getComponent(cc.Sprite).spriteFrame = self.bgLocked;
                    }
                    button.getChildByName("level").getComponent(cc.Label).string = level;
                    button.on("click", function() {
                        self.challenge(this.level);
                    }, button);
                    grid.addChild(button);
                }
                page.isLoaded = true;
            }
            for(var pageIndex = 0; pageIndex < pageCount; pageIndex++) {
                addPage();
            }
            // 监听翻页事件
            self.node.on("page-turning", function(e) {
                setPageContent(self.pageView.getCurrentPageIndex());
            });
            // 计算默认页
            var defaultPageIndex = Math.floor(window.userInfo.level / this.pageSize);
            // 转到默认页
            this.pageView.scrollToPage(defaultPageIndex);
            // 设置默认页内容
            setPageContent(defaultPageIndex);
        }
        cc.game.emit(GAME_EVENTS.LEVEL_PAGES_LOADED);
    },

    onDestroy () {
        cc.loader.releaseRes("btnlevel");
        cc.loader.releaseRes("level_page");
    },

    // update (dt) {},

    /**
     * 开始挑战
     */
    challenge (level) {
        if (level > window.userInfo.level + 1) {
            return;
        }
        
        if (window.userInfo.health >= HP_TYPE.PLAY_SUB_HP) {//SUB_HP_NUM
            Tools.commonChangeHp(-HP_TYPE.PLAY_SUB_HP);
        } else {
            UI.showLessHp({
                title: "提示",
                content: "体力不足，分享给好友获取体力",
                showCancel: true,
                success: () => {
                    console.log('点击分享');
                }
            });
            return;
        }
        
        window.level = level;
        cc.director.loadScene("Main");
       return;
        Service.startGame({level: level})
        .then(res => {
            if (Array.isArray(res.consumes) && res.consumes.length > 0) {
                res.consumes.forEach(item => {
                    Prop.consume(item.type, item.amount);
                    window.platform.showToast({
                        title: "本次闯关消耗金币x" + item.amount,
                        icon: "none",
                        complete: () => {
                            window.level = level;
                            cc.director.loadScene("Main");
                        }
                    });
                });
            } else {
                window.level = level;
                cc.director.loadScene("Main");
            }
        })
        .catch(errmsg => {
            if (errmsg == ERRORS.SERVICEERR.ERR_LACK_OF_GOLDCOIN) {
                // 提示金币不足
                window.platform.showToast({
                    title: "金币不足",
                    icon: "none"
                });
            }
        });
    }
});
