const config = require("./WechatGameConfig");
/**
 * 定义登录错误
 */
var LoginError = (function () {
    function LoginError(type, message) {
        Error.call(this, message);
        this.type = type;
        this.message = message;
    }

    LoginError.prototype = new Error();
    LoginError.prototype.constructor = LoginError;

    return LoginError;
})();
/**
 * 定义请求错误
 */
var RequestError = (function () {
    function RequestError(type, message) {
        Error.call(this, message);
        this.type = type;
        this.message = message;
    }

    RequestError.prototype = new Error();
    RequestError.prototype.constructor = RequestError;

    return RequestError;
})();
var noop = function() {}
cc.Class({
    extends: cc.Node,

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
        session_key: {
            default: "weapp_session",
            type: cc.String
        },
        /**
         * 启动参数
         * {
         *      scene: {Number} 场景值
         *      query: {Object} path参数
         *      isSticky: {Boolean} 当前小游戏是否被显示在聊天顶部
         *      shareTicket: {String} shareTicket
         * }
         */
        launchOptions: {
            default: {},
            type: cc.Object
        }
    },
    /**
     * 初始化
     */
    init({afterLogin}) {
        cc.log("init wechat game");
        if (typeof wx === "undefined") return;
        // 设置登录回调
        this.afterLogin = afterLogin;
        // 获取启动参数
        this.launchOptions = wx.getLaunchOptionsSync();
        /*
        this.launchOptions = {
            query: {
                help_seeker_id: 10947, level: 5
            }
        }
        */
        cc.log("launch options:", this.launchOptions);
        // 获取系统信息
        window.systemInfo = wx.getSystemInfoSync();
        // 版本管理设置
        if (wx.getUpdateManager) {
            var updateManager = wx.getUpdateManager();

            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    
                }
            });

            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                        }
                    }
                });

            });

            updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
                util.showModel('更新失败，请检查网络连接');
            });
        }

        // 从缓存中加载用户信息
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo instanceof Object) {
            window.userInfo = userInfo;
        } else {
            window.userinfo = {};
        }

        // 下载远程字体文件
        wx.downloadFile({
            url: config.remoteFontFileUrl,
            header: {
                "Content-Type": "application/octet-stream"
            },
            filePath: "",
            success: function(res) {
                cc.log(res.tempFilePath);
                wx.loadFont(res.tempFilePath);
            },
            fail: function(e) {
                cc.error(e);
            }
        })

        // 监听小游戏回到前台事件
        wx.onShow((options) => {
            cc.log("onshow options:", options);
            // 启用物理系统
            cc.director.getPhysicsManager().enabled = true;
            wx.triggerGC();
            this.launchOptions = options;
            this.checkSession();
        });
        // 监听小游戏隐藏到后台事件
        wx.onHide(() => {
            // 禁用物理系统
            cc.director.getPhysicsManager().enabled = false;
            wx.triggerGC();
            wx.setStorageSync('userInfo', window.userInfo);
            this.setUserCloudStorage();
        });

        // 创建游戏圈按钮
        var gameClubButtonConfig  = Object.assign({}, config.gameClubButtonConfig);
        var scale = window.systemInfo.screenWidth / cc.winSize.width;
        gameClubButtonConfig.style.top *= scale;
        gameClubButtonConfig.style.left *= scale;
        gameClubButtonConfig.style.width *= scale;
        gameClubButtonConfig.style.height *= scale;
        this.gameClubButton = wx.createGameClubButton(gameClubButtonConfig);

        /**
         * 初始化开放数据域纹理
         */
        this.openDataTexture = new cc.Texture2D();
        this.openDataContext = wx.getOpenDataContext();

        /**
         * 显示当前页面的转发按钮
         */
        wx.showShareMenu({withShareTicket: true});

        /**
         * 设置分享信息
         */
        wx.onShareAppMessage(function(){
            return config.shareConfig;
        });

        /**
         * 监听内存不足告警
         */
        wx.onMemoryWarning(function(){
            cc.warn("内存空间不足");
        });
    },

    setUserCloudStorage() {
        wx.setUserCloudStorage({
            KVDataList: [
                {
                    key: "level",
                    value: window.userInfo.level.toString()
                },
                {
                    key: "love",
                    value: window.userInfo.love.toString()
                }
            ],
            success() {
                cc.info("setUserCloudStorage success");
            },
            fail(e) {
                cc.error(e);
            },
            complete() {}
        });
    },

    setUserInfoStorage() {
        wx.setStorageSync('userInfo', window.userInfo);
    },

    /**
     * 获取最新的开放数据域纹理
     */
    getOpenDataTexture() {
        if (!this.openDataTexture) {
            return;
        }
        var sharedCanvas = this.openDataContext.canvas;
        this.openDataTexture.initWithElement(sharedCanvas);
        this.openDataTexture.handleLoadedTexture();
        return this.openDataTexture;
    },
    /**
     * 显示好友排行榜
     */
    showFriendRank() {
        this.openDataContext.postMessage({
            type: 'showFriendRank'
        })
    },
    /**
     * 隐藏好友排行榜
     */
    hideFriendRank() {
        this.openDataContext.postMessage({
            type: 'hideFriendRank'
        })
    },
    /**
     * 显示群排行榜
     * @param {String} shareTicket 
     */
    showGroupRank(shareTicket) {
        this.openDataContext.postMessage({
            type: 'showGroupRank',
            shareTicket: shareTicket
        })
    },
    /**
     * 展示用户信息
     * @param {String} openid 
     */
    showUserInfo(openid) {
        this.openDataContext.postMessage({
            type: 'showUserInfo',
            openid: openid
        });
    },
    /**
     * 隐藏用户信息
     */
    hideUserInfo() {
        this.openDataContext.postMessage({
            type: 'hideUserInfo'
        });
    },
    getHelpInfo() {
        const {help_seeker_id, level} = this.launchOptions.query;
        return {
            help_seeker_id: help_seeker_id ? parseInt(help_seeker_id) : help_seeker_id,
            level: level ? parseInt(level) : level
        };
    },
    clearHelpInfo() {
        if (this.launchOptions.query) {
            this.launchOptions.query.help_seeker_id = null;
            this.launchOptions.query.level = null;
        }
    },
    showModal({title, content, showCancel, success,fail}) {
        wx.showModal({
            title: title,
            content: content,
            showCancel: typeof showCancel !== "undefined" ? showCancel : true,
            success: typeof success !== "undefined" ? success : noop,
            fail: typeof fail !== "undefined" ? fail : noop
        });
    },
    showToast({title, icon, image, duration, success, fail, complete}) {
        wx.showToast({
            title, icon, image,
            duration: duration ? duration : 1000,
            success: success ? success : noop,
            fail: fail ? fail : function(e){cc.error(e)},
            complete: complete ? complete : noop
        });
    },
    showLoading({title = '', mask = false, success = noop, fail = noop, complete = noop}) {
        wx.showLoading({
            title,
            mask,
            success,
            fail,
            complete
        });
    },
    hideLoading({success = noop, fail = noop, complete = noop}) {
        wx.hideLoading({
            success,
            fail,
            complete
        });
    },
    /**
     * 分享
     * {title, imageUrl, query}
     */
    share(shareConfig) {
        wx.shareAppMessage(Object.assign(config.shareConfig, shareConfig));
    },
    /**
     * 登录
     */
    login() {
        var self = this;
        return new Promise((resolve, reject) => {
            var options = Object.assign({}, config.loginOptions, {
                success(result) {
                    if (result && result.userinfo) {
                        // 用户主题数据转换
                        if (result.userinfo.themes) {
                            result.userinfo.themes = result.userinfo.themes.split(",");
                        } else {
                            result.userinfo.themes = [];
                        }
                        wx.setStorageSync('userInfo', window.userInfo = Object.assign(window.userInfo || {}, result.userinfo));
                        self.setUserCloudStorage();
                        if (typeof self.afterLogin == "function") {
                            self.afterLogin(result);
                        }
                    }
                    resolve(result);
                },
    
                fail(e) {
                    cc.error(e);
                    reject(e)
                }
            });
    
            if (!options.loginUrl) {
                options.fail(new LoginError('ERR_INVALID_PARAMS', '登录错误：缺少登录地址'));
                return;
            }
        
            var doLogin = function () {
        
                // 构造请求头，包含 code
                wx.showLoading({
                    title: '正在登录',
                });
                wx.login({
                    success: function (loginResult) {
                        var header = {};
                        header['X-WX-Code'] = loginResult.code;
        
                        // 请求服务器登录地址，获得会话信息
                        wx.request({
                            url: options.loginUrl,
                            header: header,
                            method: options.method,
                            data: options.data,
                            success: function (result) {
                                cc.log("login result:", result);
                                var data = result.data;
        
                                // 成功地响应会话信息
                                if (data && data.code === 0 && data.data.skey) {
                                    var res = data.data
                                    if (res.userinfo) {
                                        self.setSession(res.skey);
                                        options.success(res);
                                    } else {
                                        var errorMessage = '登录失败(' + data.error + ')：' + (data.message || '未知错误');
                                        var noSessionError = new LoginError('ERR_LOGIN_SESSION_NOT_RECEIVED', errorMessage);
                                        options.fail(noSessionError);
                                    }
        
                                    // 没有正确响应会话信息
                                } else {
                                    var noSessionError = new LoginError('ERR_LOGIN_SESSION_NOT_RECEIVED', JSON.stringify(data));
                                    options.fail(noSessionError);
                                }
                            },
        
                            // 响应错误
                            fail: function (loginResponseError) {
                                cc.error(loginResponseError);
                                var error = new LoginError('ERR_LOGIN_FAILED', '登录失败，可能是网络错误或者服务器发生异常');
                                options.fail(error);
                            },
                            complete: function () {
                                wx.hideLoading();
                            }
                        });
                    },
        
                    fail: function (loginError) {
                        wx.showToast({
                            title: '微信登录失败，请检查网络状态',
                            icon: 'none'
                        });
                        options.fail(loginError);
                    }
                });
            };
            var session = self.getSession();
            if (session) {
                options.success();
            } else {
                doLogin();
            }
        });
    },
    request(options) {
        var self = this;
        if (typeof options !== 'object') {
            var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
            throw new RequestError('ERR_INVALID_PARAMS', message);
        }
    
        var requireLogin = options.login;
        var success = options.success || noop;
        var fail = options.fail || noop;
        var complete = options.complete || noop;
        var originHeader = options.header || {};
    
        // 成功回调
        var callSuccess = function () {
            success.apply(null, arguments);
            complete.apply(null, arguments);
        };
    
        // 失败回调
        var callFail = function (error) {
            wx.showModal({
                title: "提示",
                content: "请检查网络连接",
                showCancel: false,
                success: function() {
                    
                }
            });
            fail.call(null, error);
            complete.call(null, error);
        };
    
        // 是否已经进行过重试
        var hasRetried = false;
    
        if (requireLogin) {
            doRequestWithLogin();
        } else {
            doRequest();
        }

        function buildAuthHeader(session) {
            var header = {};
        
            if (session) {
                header['X-WX-Skey'] = session;
            }
        
            return header;
        };
    
        // 登录后再请求
        function doRequestWithLogin() {
            self.login().then(doRequest).catch(callFail);
        }
    
        // 实际进行请求的方法
        function doRequest() {
            var authHeader = buildAuthHeader(self.getSession());
    
            wx.request(Object.assign({}, options, {
                header: Object.assign({}, originHeader, authHeader),
    
                success: function (response) {
                    var data = response.data;
    
                    var error, message;
                    if (data && data.code === -1) {
                        self.clearSession();
                        // 如果是登录态无效，并且还没重试过，会尝试登录后刷新凭据重新请求
                        if (!hasRetried) {
                            hasRetried = true;
                            doRequestWithLogin();
                            return;
                        }
    
                        message = '登录态已过期';
                        error = new RequestError(data.error, message);
    
                        callFail(error);
                        return;
                    } else {
                        callSuccess.apply(null, arguments);
                    }
                },
    
                fail: callFail,
                complete: function(){},
            }));
        };
    
    },
    /**
     * 退出当前小游戏
     */
    exit() {
        wx.exitMiniProgram({
            success() {},
            fail() {},
            complete() {}
        });
    },
    /**
     * 设置会话
     * @param {String} session 
     */
    setSession(session) {
        wx.setStorageSync(this.session_key, session);
    },
    /**
     * 获取会话
     */
    getSession() {
        return wx.getStorageSync(this.session_key) || null;
    },
    /**
     * 清除会话
     */
    clearSession() {
        wx.removeStorageSync(this.session_key);
    },
    /**
     * 检查会话是否过期
     * @param {Boolean} forceRefresh 
     * @returns {Promise}
     */
    checkSession(forceRefresh = false) {
        var self = this;
        if (forceRefresh) {
            self.clearSession();
            return self.login()
            .catch(e => {
                cc.error(e);
                wx.showModal({
                    title: "提示",
                    content: "登录失败，请检查网络连接",
                    showCancel: false,
                    success: function() {
                        //self.exit();
                    }
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                if (!self.getSession()) {
                    self.login()
                    .then((res) => resolve(res))
                    .catch(e => {
                        reject(e);
                    });
                } else {
                    wx.checkSession({
                        success: function () {
                            if (typeof self.afterLogin == "function") {
                                self.afterLogin();
                            }
                            resolve();
                        },
        
                        fail: function () {
                            self.clearSession();
                            self.login()
                            .then((res) => resolve(res))
                            .catch(e => {
                                reject(e);
                            });
                        }
                    });
                }
            })
            .catch(e => {
                cc.error(e);
                wx.showModal({
                    title: "提示",
                    content: "登录失败，请检查网络连接",
                    showCancel: false,
                    success: function() {
                        //self.exit();
                    }
                });
            });
        }
    },
    setStorageSync(key, data) {
        wx.setStorageSync(key, data);
    },
    setStorage({key, data, success, fail, complete}) {
        wx.setStorageSync({
            key,
            data,
            success: success ? success: noop,
            fail: fail ? fail: noop,
            complete: complete ? complete : noop
        });
    },
    getStorageSync(key) {
        return wx.getStorageSync(key);
    },
    getStorage({key, success, fail, complete}) {
        wx.getStorage({
            key,
            success: success ? success: noop,
            fail: fail ? fail: noop,
            complete: complete ? complete : noop
        });
    },
    createImage() {
        return wx.createImage();
    },
    loadImage(sprite, url) {
        let image = wx.createImage();
        image.onload = function () {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
    },
    triggerGC() {
        //加快触发垃圾回收
        wx.triggerGC();
    },
    createRewardedVideoAd({complete, cancel, fail}) {
        let videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-65983b5ddb6dc3ba'
        });
        videoAd.load()
        .then(() => videoAd.show())
        .catch(err => {
            cc.log(err.errMsg);
            if (typeof fail == "function") {
                fail(err);
            }
        });
        videoAd.onClose(function(res){
            if (res.isEnded) {
                if (typeof complete == "function") {
                    complete();
                }
            } else {
                if (typeof cancel == "function") {
                    cancel();
                }
            }
        });
    },
    /**
     * 显示游戏圈按钮
     */
    showGameClubButton () {
        this.gameClubButton.show();
    },
    /**
     * 隐藏游戏圈按钮
     */
    hideGameClubButton () {
        this.gameClubButton.hide();
    }
});
