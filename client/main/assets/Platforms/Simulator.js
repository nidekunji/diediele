/**
 * @author kunji
 * @description 模拟器登录
 * @time 2020.5.26
 */
const {PROP_TYPE, PAY_TYPE} = require('../Utils/Constants');
const baseUrl = 'https://moneygame.dianjinyouxi.com/res/';

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
        
        /**
         * 启动参数
         * {
         *      scene: {Number} 场景值
         *      query: {Object} path参数
         *      isSticky: {Boolean} 当前小游戏是否被显示在聊天顶部
         *      shareTicket: {String} shareTicket
         * }
         */
    },
    /**
     * 初始化
     */
    init({afterLogin}) {
        cc.log("init simulator");
        // 设置登录回调
        this.afterLogin = afterLogin;
    },

    /**
     * 获取关卡数据
     * @param {} level 
     */

    /**
     * 上传数据
     */
    setUserCloudStorage() {
       if (Tools.isFromWx()) {
        console.log('=======上传到微信排行榜======');
        WxTools.setUserCloudStorage();
       }
    },

    setUserInfoStorage() {
        if (Tools.isFromWx()) {
            WxTools.setUserInfoStorage();
        }
    },

    /**
     * 获取最新的开放数据域纹理
     */
    getOpenDataTexture() {
        if (Tools.isFromWx()) {
            WxTools.getOpenDataTexture();
        }
    },
    /**
     * 显示好友排行榜
     */
    showFriendRank() {
       if (Tools.isFromWx()) {
            WxTools.showFriendRank();
        }
    },
    /**
     * 隐藏好友排行榜
     */
    hideFriendRank() {
        if (Tools.isFromWx()) {
            WxTools.hideFriendRank();
        }
    },
    /**
     * 显示群排行榜
     * @param {String} shareTicket 
     */
    showGroupRank(shareTicket) {
        if (Tools.isFromWx()) {
            WxTools.showGroupRank(shareTicket);
        }
    },
    /**
     * 展示用户信息
     * @param {String} openid 
     */
    showUserInfo(openid) {
        if (Tools.isFromWx()) {
            WxTools.showUserInfo(openid);
        }
    },
    /**
     * 隐藏用户信息
     */
    hideUserInfo() {
        if (Tools.isFromWx()) {
            WxTools.hideUserInfo();
        }
    },
    getHelpInfo() {
        if (Tools.isFromWx()) {
          return WxTools.getHelpInfo();
        } else {
            return {};
        }
    },
    clearHelpInfo() {
        if (Tools.isFromWx()) {
            WxTools.clearHelpInfo();
        } 
    },
    showModal({title, content, showCancel, success,fail}) {
      //  console.log("未实现");
    },
    showToast({title, icon, image, duration, success, fail, complete}) {
       // console.log("未实现");
    },
    showLoading({title = '', mask = false, success = noop, fail = noop, complete = noop}) {
      //  console.log("未实现");
    },
    hideLoading({success = noop, fail = noop, complete = noop}) {
      //  console.log("未实现");
    },
    /**
     * 分享
     * {title, imageUrl, query}
     */
    share(shareConfig) {
       // console.log("未实现");
    },
    
    login() {
        var self = this;
        var doLogin = function () {
            let success = function (res) {
            cc.log("login result:", res);
            var data = res.data;
            // 成功地响应会话信息
            if (res.code === 0  && data && data.skey) {
                if (data.userinfo) {//用户信息
                    self.setSession(data.skey);
                    if (data.userinfo.themes) {
                        data.userinfo.themes = data.userinfo.themes.split(",");
                    } else {
                        data.userinfo.themes = [];
                    }
                    window.userInfo = Object.assign(window.userInfo || {}, data.userinfo);
                    console.log(window.userInfo, 'window.userInfo');
                    if (typeof self.afterLogin == "function") {
                        self.afterLogin(data);
                    }
                } else {
                    var errorMessage = '登录失败(' + data.error + ')：' + (data.message || '未知错误');
                    var noSessionError = new LoginError('ERR_LOGIN_SESSION_NOT_RECEIVED', errorMessage);
                    console.log(noSessionError, 'noSessionError');
                }
            } else {
                // 没有正确响应会话信息
                var noSessionError = new LoginError('ERR_LOGIN_SESSION_NOT_RECEIVED', JSON.stringify(data));
                console.log(noSessionError, 'noSesionError');
            }
        };
        if (!Tools.isFromWx()) {
            Tools.login('dev_test', success);
        }
        };
        if (!window.session) {
            doLogin();
        } else {
            self.afterLogin(window.userInfo);
        }

    },
    request(options) {
        if (typeof options.success == "function") {
            options.success({data:{code:0, data:{}}});
        }
    },
    /**
     * 退出当前小游戏
     */
    exit() {
        
    },
    /**
     * 设置会话
     * @param {String} session 
     */
    setSession(session) {
      //  Global.session = session;
        window.session = session;
    },
    /**
     * 获取会话
     */
    getSession() {
        return null;
    },
    /**
     * 清除会话
     */
    clearSession() {
        
    },
    /**
     * 检查会话是否过期
     * @param {Boolean} forceRefresh 
     * @returns {Promise}
     */
    checkSession(forceRefresh = false) {
        this.login();
    },
    setStorageSync(key, data) {
        
    },
    setStorage({key, data, success, fail, complete}) {
        
    },
    getStorageSync(key) {
        
    },
    getStorage({key, success, fail, complete}) {
        
    },
    createImage() {
        return null;
    },
    loadImage(sprite, url) {
        cc.loader.load({ url: url, type: 'png' }, function (err, texture) {
            // Use texture to create sprite frame
            if (err) {
                return;
            }
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    },
    triggerGC() {
        
    },
    createRewardedVideoAd({complete, cancel, fail}) {
        if (typeof complete == "function") {
            complete();
        }
    },
    /**
     * 显示游戏圈按钮
     */
    showGameClubButton () {
        
    },
    /**
     * 隐藏游戏圈按钮
     */
    hideGameClubButton () {
        
    }
});

