
const {PROP_TYPE, PAY_TYPE} = require('../Utils/Constants');
var URL = 'https://moneygame.dianjinyouxi.com/res/';
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
        console.log("init simulator");
        // 设置登录回调
        this.afterLogin = afterLogin;
    },

    /**
     * 获取关卡数据
     * @param {} level 
     */
    fetchLevelCode(level) {
        var lvlcodes = [
            '390_460/r0u0u00316sr0u0u00313N_r0u0u004r4w0f001r0Y0Y004t3S3S3D1',

'765_640/t390J009a3Jt0J3o1s3E6Gt0J3o1s3w2tc0u0u006K8ec0u0u00958e_r2U0f1s1c0J0J006',

'750_550/r0Y0Y007g7Kr0Y0Y004m7K_r0Y0Y004t1W1d001t1d1W1s1r1W0J001h1d0Y001t1s1s3D1c0p0p002',

'460_565/c0J0J002q7Zc0J0J004G7Z_h1R1A001r3o0f001c0J0J002r3o0f001r0J0J003r0Y0Y002t13130J1r2A0J001t0Y0Y0J3c0Y0Y001',

'600_520/t0Y2F1s6s7vt2F0Y002U7v_r0O0O001c0p0p005r0O0O001c0p0p005r2l0f001t0T0J001t0J0T1s1r0J0J002r1s0u001r0O0O001c0Y0Y001c0f0f002',

'550_550/t0J0J0J4e7T_r4Q0f001r0J0J002t1d1d001t1d1d1s1r2A0J001c0O0O001t0Y0Y0J4r4Q0f001c0Y0Y001c0Y0Y002r1d0J002t3e3e3D1',

'550_490/r0J0J001W5dr0J0J006M5dr0J0J004g6X_c1d1d001h0Y0P001c1d1d001h0Y0P001c1d1d001h0Y0P001',

'480_475/c0f0f000n5Hc0f0f006Y5Hc0f0f002q6yc0f0f004W6y_r1H1H002c2b2b001c0Y0Y002c0u0u002h1s1f1s1c0J0J002t0J0J341t0J0J4c1r3y0k001c0J0J003r0J0J002t1M0J001t0J1H1s1',

'285_235/h0J0B000k3oh0J0B004c3o_h0J0C002r390f001h0J0C002r390f001h0J0C002r390f001c0u0u00f',

'330_415/t132b1s365Xt2b1300225Y_r2b0u3j1r2b0u2v1r2q0f001t0O0O002t0O0O1s1t0O0O2U1t0J0J3D1c0p0p001t0Y0Y001t0Y0Y1s1c0k0k004',

'285_235/h0J0B4m133kh0J0B4m1D3kh0J0B4m3p3hh0J0B4m2N3ih0J0B4m2d3k_h0J0C00dc0J0J002',

'420_535/r1i0J003g7Nr1i0J000M7Nr1i0J005K7N_t1i1i001t1i1i1s1t0E0E001t0E0E1s1c0z0z003r420k001c0z0z002r420k001c0z0z002r420k001c0z0z002r420k001c0z0z002r420k001h1H1r001r0z0z004',

'210_505/c0f0f002r34c0f0f00164bc0f0f002j5gc0f0f000T6kc0f0f001D7r_h0O0H008',

'525_610/r0f0f001r61c0f0f002k8Bc0f0f000g7dc0f0f007u8F_h0z0u002h0J0C002h0T0L002h130T002r5k0E1s1r710f001t1H1H001',

'480_505/h1s1g1s0O7ch1s1g1s3I7ch1s1g1s6u7c_r1M0k002h0u0q004r2U0k001h0u0q004r2U0k001h0u0q002r2U0k001t2U2U3D1c0p0p003c0J0J004',

'375_550/c0f0f00227Pc0f0f003W7Pc0f0f001663_r2U0k1s1t2K13001t132K1s1r0z0z00ar1s1s001',

'435_325/t0J0J001I3dr0J0J001w4x_r3D0K001t1d1W1s1c0k0k006t0u0u001',

'600_475/c0f0f007I5hc0f0f00225hc0f0f00666Fc0f0f003c6F_r4m0k1s1r1W0k001t3o1d001t0Y0Y2U1r0J0J002r4Q0k001r0O0O006r2U2U001',

'400_475/r0J0J001W6Qr0J0J004g6Q_r470u1s2r2P0k001r0Y0Y003r2g0f001r2v0f551r2v0f0J1h0u0q0Jch0u0q55ch0u0q1sc',

'600_520/h1H1r1s4E5Ac0f0f006A7kc0f0f008k7kc0f0f002I7kc0f0f000Y7k_r2U0J1s2r0Y0Y004t0O0O001t0O0O1s1c0J0J001t0O0O001t0O0O1s1c0J0J001t0Y0Y001t0Y0Y1s1r7g0J001r0Y0Y008r3o3o001',
        ];
        return new Promise((resolve, reject) => {
            if (typeof lvlcodes[level] !== "undefined") {
                resolve(lvlcodes[level]);
                return;
            }
            resolve(lvlcodes[0]);
        });
    },

    fetchSetting() {
        return new Promise((resolve, reject) => {
            resolve({
                levelCount: 20, // 关卡数量
                loginPrizes: [
                    // 周日
                    [
                        {
                            type: PROP_TYPE.GOLD_COIN,
                            amount: 700,
                            icon: "gold5"
                        }
                    ],
                    // 周一
                    [
                        {
                            type: PROP_TYPE.GOLD_COIN,
                            amount: 100,
                            icon: "gold1"
                        }
                    ],
                    // 周二
                    [
                        {
                            type: PROP_TYPE.LOVE,
                            amount: 20,
                            icon: "love1"
                        }
                    ],
                    // 周三
                    [
                        {
                            type: PROP_TYPE.GOLD_COIN,
                            amount: 200,
                            icon: "gold2"
                        }
                    ],
                    // 周四
                    [
                        {
                            type: PROP_TYPE.GOLD_COIN,
                            amount: 300,
                            icon: "gold3"
                        }
                    ],
                    // 周五
                    [
                        {
                            type: PROP_TYPE.LOVE,
                            amount: 50,
                            icon: "love2"
                        }
                    ],
                    // 周六
                    [
                        {
                            type: PROP_TYPE.GOLD_COIN,
                            amount: 500,
                            icon: "gold4"
                        }
                    ]
                ], // 登录奖励设置
                sharePrizes: [
                    {
                        type: PROP_TYPE.GOLD_COIN,
                        amount: 500
                    }
                ], // 分享奖励设置
                lotteryDrawPrizes: [
                    {
                        id: 1,
                        type: PROP_TYPE.GOLD_COIN,
                        amount: 50,
                        icon: 'gold1',
                        probability: 30
                    },
                    {
                        id: 2,
                        type: PROP_TYPE.LOVE,
                        amount: 20,
                        icon: 'love1',
                        probability: 30
                    },
                    {
                        id: 3,
                        type: PROP_TYPE.GOLD_COIN,
                        amount: 100,
                        icon: 'gold2',
                        probability: 20
                    },
                    {
                        id: 4,
                        type: PROP_TYPE.GOLD_COIN,
                        amount: 200,
                        icon: 'gold3',
                        probability: 10
                    },
                    {
                        id: 5,
                        type: PROP_TYPE.LOVE,
                        amount: 50,
                        icon: 'love2',
                        probability: 5
                    },
                    {
                        id: 6,
                        type: PROP_TYPE.GOLD_COIN,
                        amount: 300,
                        icon: 'gold4',
                        probability: 5
                    }
                ], // 抽奖奖池
                themes: [
                    {
                        id: "default",
                        name: "默认皮肤",
                        thumb: URL + "default.png",
                        paytype: PAY_TYPE.GOLD_COIN,
                        total: 0
                    },
                    {
                        id: "animal",
                        name: "动物世界",
                        thumb: URL +"animal.png",
                        paytype: PAY_TYPE.LOVE,
                        total: 500
                    },
                    {
                        id: "piggy",
                        name: "小猪佩奇",
                        thumb: URL +"piggy.png",
                        paytype: PAY_TYPE.LOVE,
                        total: 500
                    }
                ]  // 主题列表
            });
        });
    },

    setUserCloudStorage() {
        console.log("未实现");
    },

    setUserInfoStorage() {
        console.log("未实现");
    },

    /**
     * 获取最新的开放数据域纹理
     */
    getOpenDataTexture() {
        console.log("未实现");
    },
    /**
     * 显示好友排行榜
     */
    showFriendRank() {
        console.log("未实现");
    },
    /**
     * 隐藏好友排行榜
     */
    hideFriendRank() {
        console.log("未实现");
    },
    /**
     * 显示群排行榜
     * @param {String} shareTicket 
     */
    showGroupRank(shareTicket) {
        console.log("未实现");
    },
    /**
     * 展示用户信息
     * @param {String} openid 
     */
    showUserInfo(openid) {
        console.log("未实现");
    },
    /**
     * 隐藏用户信息
     */
    hideUserInfo() {
        console.log("隐藏教程未实现");
    },
    getHelpInfo() {
        return {};
    },
    clearHelpInfo() {
        console.log("清除教程未实现");
    },
    showModal({title, content, showCancel, success,fail}) {
        console.log("显示模态框未实现");
    },
    showToast({title, icon, image, duration, success, fail, complete}) {
        console.log("显示公用消息框未实现");
    },
    showLoading({title = '', mask = false, success = noop, fail = noop, complete = noop}) {
        console.log("显示加载未实现");
    },
    hideLoading({success = noop, fail = noop, complete = noop}) {
        console.log("隐藏加载未实现");
    },
    /**
     * 分享
     * {title, imageUrl, query}
     */
    share(shareConfig) {
        console.log("未实现");
    },
    /**
     * 登录
     */
    login() {
        var self = this;
        return new Promise((resolve, reject) => {
            var result = {
                userinfo: {
                    uid: 0,
                    nickname: "Jerry",
                    avatar_url: "",
                    gender: 1,
                    country: "",
                    city: "",
                    province: "",
                    language: "zh_CN",
                    level: 20,
                    paragraph_level: 0,
                    themes: "",
                    goldcoin: 1000,
                    love: 100,
                  //  last_visit_time: Math.floor(Date.now() / 1000),
                },
                registerPrizes: [],
                loginPrizes: [],
                time: Math.floor(Date.now() / 1000),
                day: "2020-01-01"
            };
            if (result && result.userinfo) {
                // 用户主题数据转换
                if (result.userinfo.themes) {
                    result.userinfo.themes = result.userinfo.themes.split(",");
                } else {
                    result.userinfo.themes = [];
                }
                window.userInfo = Object.assign(window.userInfo || {}, result.userinfo)
                if (typeof self.afterLogin == "function") {
                    self.afterLogin(result);
                }
            }
            resolve(result);
        });
    },
    request(options) {//改成HTTP请求
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
