var CONSTS = require('../Utils/Constants');
var Prop = require('../Utils/Prop');
var WechatGame = require('../Platforms/WechatGame');
var QQPlay = require('../Platforms/QQPlay');
var Simulator = require('../Platforms/Simulator');
var ThemeManager = require('../Utils/ThemeManager');
var Service = require('../Utils/Service');
var Global = require('../Utils/GlobalData');
cc.Class({
    extends: cc.Component,

    properties: {
       
        /**
         * 发布平台
         */
        platform: {
            default: CONSTS.PLATFORM.WECHAT_GAME,
            displayName: "运行环境",
            tooltip: "",
            type: cc.Enum({
                "模拟器": CONSTS.PLATFORM.SIMULATOR,
                "微信小游戏": CONSTS.PLATFORM.WECHAT_GAME,
                "QQ玩一玩": CONSTS.PLATFORM.QQ_PLAY
            })
        },
        guideMask: {
            default: null,
            displayName: "指引遮罩",
            type: cc.Node
        },
        buttonPressAudio: {
            default: null,
            displayName: "按钮点击音效",
            type: cc.AudioSource
        }
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 监听按钮点击事件
        cc.game.on("button press", () => {
            this.buttonPressAudio.play();
        });
        // 设置为永久贮存节点
        cc.game.addPersistRootNode(this.node);

        //全局数据初始化
        window.Global = Global;
    },

    start () {
        if(!window.server) {
            window.server = {};
        }
        if (!window.platform) {
            switch(this.platform) {
                // 模拟器
                case CONSTS.PLATFORM.SIMULATOR : {
                    this.guideMask.active = false;
                    window.platform = new Simulator();
                    break;
                }
                // 微信小游戏
                case CONSTS.PLATFORM.WECHAT_GAME : {
                    window.platform = new WechatGame();
                    break;
                }
                // QQ玩一玩
                case CONSTS.PLATFORM.QQ_PLAY : {
                    window.platform = new QQPlay();
                    break;
                }
                default: throw new Error("invalid platform");
            }
            window.platform.init({
                afterLogin: this.afterLogin.bind(this)
            });
            window.platform.checkSession(true);
           // cc.game.emit("platform inited");
        }
        cc.loader.onProgress = function (completedCount, totalCount, item) {
          //  console.log(completedCount, totalCount, 'completeCount,totalCount');
            if (totalCount == completedCount) {
                window.platform.hideLoading({
                    fail(error) {
                        cc.error(error);
                    }
                });
            } else {
                window.platform.showLoading({
                    title: "场景加载中...",
                    mask: true
                });
            }
        };
    },

    /**
     * 登录成功后的处理
     */
    afterLogin (loginResult) {
        var self = this;
        console.log("after login:", loginResult);
        try {
            cc.game.emit("logged");
            if (loginResult) {
                // 服务器时间戳
                if (loginResult.time) {
                    window.server.timestamp = loginResult.time;
                }
                // 服务器星期
                if (typeof loginResult.day !== "undefined") {
                    window.server.day = loginResult.day;
                }
                // 用户信息处理
                if (loginResult.userinfo) {
                    // 道具数量
                    Prop.set(CONSTS.PROP_TYPE.GOLD_COIN, loginResult.userinfo.goldcoin);
                    Prop.set(CONSTS.PROP_TYPE.LOVE, loginResult.userinfo.love);
                }
                // 注册奖励处理
                if (Array.isArray(loginResult.registerPrizes) && loginResult.registerPrizes.length > 0) {
                    Prop.prize(...loginResult.registerPrizes);
                }
            }

            // 判断是否开启新手指引
            if (loginResult && loginResult.userinfo && !loginResult.userinfo.last_visit_time) {
                if (!window.guideManager) {
                    var GuideManager = require('../Utils/GuideManager');
                    window.guideManager = new GuideManager();
                    window.guideManager.enabled = true;
                    window.guideManager.onFinish = function() {
                        self.guideMask.active = false;
                        window.platform.triggerGC();
                    }
                }
            }

            // 未开启新手指引的情况下
            if (window.guideManager && window.guideManager.enabled) {
                window.platform.clearHelpInfo();
            } else {
                self.guideMask.active = false;
                // 判断求助信息
                const {help_seeker_id, level} = window.platform.getHelpInfo();
                if (help_seeker_id && level && (help_seeker_id !== window.userInfo.uid)) {
                    window.platform.showModal({
                        title: "提示",
                        content: "是否帮助好友闯关？",
                        success: function(res) {
                            if (res.confirm) {
                                window.level = level;
                                cc.director.loadScene("Main");
                            } else {
                                window.platform.clearHelpInfo();
                            }
                        },
                        fail: function() {
                            window.platform.clearHelpInfo();
                        }
                    });
                }
            }

            // 获取游戏设置
            this.getSetting()
            .then(setting => {

                // 初始化主题管理器
                if (!window.themeManager) {
                    window.themeManager = new ThemeManager();
                    window.themeManager.init(setting.themes);
                }
                function showLoginPrices(loginPrizes) {
                    return new Promise(function(resolve, reject) {
                        //登录奖励
                        cc.loader.loadRes("loginprize", function(error, resource){
                            if (error) {
                                cc.error("error when loadRes `loginprize`", error);
                                reject();
                                return;
                            }
                            var loginPrizeNode = cc.instantiate(resource);
                            loginPrizeNode.getComponent("LoginPrize").refresh();
                            loginPrizeNode.on("confirm", () => {
                                Prop.prize(...loginPrizes);
                            });
                            cc.find("Canvas").addChild(loginPrizeNode);
                            resolve()
                        });
                    });
                }
                // 登录奖励处理,暂时没有，后期看
               // console.log(loginResult.loginPrizes, 'loginResult.loginPrizes');
                if (loginResult && Array.isArray(loginResult.loginPrizes) && loginResult.loginPrizes.length > 0) {
                    if (window.guideManager && window.guideManager.enabled) {
                        window.guideManager.after(CONSTS.GUIDE_STEPS.LOGIN_PRIZE_TIP, function() {
                            showLoginPrices(loginResult.loginPrizes).then(() => {
                                window.guideManager.next();
                            });
                        });
                    } else {
                        showLoginPrices(loginResult.loginPrizes);
                    }
                }
            })
            .then(() => {
                cc.game.emit("setting inited");
            })
            .catch(e => {
                console.error(e);
                cc.game.emit(CONSTS.GUIDE_EVENTS.STEP_ERROR);
                window.platform.showModal({
                    title: "系统异常",
                    content: `游戏设置获取失败: ${e.message}`,
                    showCancel: false
                });
            });

            // 获取用户消息
            this.getUserMessage();

        } catch (error) {
            cc.error(error);
        }
    },

    getUserMessage () {
        var self = this;
        return Service.getUserMessage({
            scene: CONSTS.SCENES.ALL
        })
        .then(res => {//好友帮你闯关
            if (res && res.messages) {
                res.messages.forEach(message => {
                    switch(message.type) {
                        case CONSTS.USER_MESSAGE_TYPE.FRIEND_HELP_SUCCESS : {
                            self.handleFriendHelpSuccess(message);
                        }
                        default: break;
                    }
                });
            }
        })
        .catch(e => {
            cc.error(e);
        });
    },

    handleFriendHelpSuccess (message) {
        var data = JSON.parse(message.content);
        cc.loader.loadRes("dialog_helper", function(error, resource) {
            if (error) {
                cc.error("error when loadRes `dialog helper`", error);
                return;
            }
            // 奖励处理
            if (data.prizes && Array.isArray(data.prizes) && data.prizes.length > 0) {
                Prop.prize(...data.prizes);
            }
            // 更新闯关进度
            if (data.level > window.userInfo.level) {
                window.userInfo.level = data.level;
                window.platform.setUserCloudStorage();
            }
            // 显示弹窗
            var dialog = cc.instantiate(resource);
            dialog.getComponent("DialogHelper").setData(data);
            cc.director.getScene().addChild(dialog);

            // 确认消息已接收并展示
            Service.confirmUserMessage(message.id);
        });
    },

    /**
     * 获取游戏设置
     */
    getSetting() {
        return new Promise((resolve, reject) => {
            if (!window.setting) {
                Service.fetchSetting()
                .then(setting => {
                    window.setting = {
                        levelCount: setting.levelCount, // 关卡数量
                        loginPrizes: setting.loginPrizes, // 登录奖励设置
                        sharePrizes: setting.sharePrizes, // 分享奖励设置
                        lotteryDrawPrizes: setting.lotteryDrawPrizes, // 抽奖奖池
                        themes: setting.themes  // 主题列表
                    }
                    resolve(window.setting);
                })
                .catch(e => {
                    reject(e);
                });
            } else {
                resolve(window.setting);
            }
        });
    }

    // update (dt) {},
});
