const baseUrl = "https://ssp.hlwyb.chenzhaohua.com/weapp";
//const baseUrl =  "http://193.112.178.147:5757/weapp";
function fetchSetting() {
    if (typeof window.platform.fetchSetting == "function") {
        return window.platform.fetchSetting();
    }
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/setting/all",
            method: "GET",
            success: function(res) {
                console.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function fetchLevelCode(level) {
    if (typeof window.platform.fetchLevelCode == "function") {
        return window.platform.fetchLevelCode(level);
    }
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/level/code",
            method: "GET",
            data: {lvl: level},
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function startGame({level, help_seeker_id}) {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/game/start",
            method: "POST",
            login: true,
            data: {level: level, help_seeker_id: help_seeker_id},
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function gameSuccess({level, help_seeker_id}) {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/game/success",
            method: "POST",
            login: true,
            data: {level: level, help_seeker_id: help_seeker_id},
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function gameSkip(level) {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/game/skip",
            method: "POST",
            login: true,
            data: {level},
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function gameShareToGroupPrize() {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/game/shareToGroupPrize",
            method: "GET",
            login: true,
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function getUserMessage({scene}) {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/user/message",
            method: "GET",
            login: true,
            data: {scene: scene},
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function confirmUserMessage(msgid) {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/user/message/confirm",
            method: "POST",
            login: true,
            data: {msgid: msgid},
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function buyTheme(theme_id) {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/theme/buy",
            method: "POST",
            login: true,
            data: {theme_id: theme_id},
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function getLotteryDrawState() {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/lotterydraw/state",
            method: "GET",
            login: true,
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function runLotteryDraw() {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/lotterydraw/run",
            method: "GET",
            login: true,
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function shareLotteryDraw() {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/lotterydraw/share",
            method: "GET",
            login: true,
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function runLotteryDrawForce() {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/lotterydraw/forceRun",
            method: "GET",
            login: true,
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function canOpenTimedBag() {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/timedbag/canOpen",
            method: "GET",
            login: true,
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function openTimedBag() {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/timedbag/open",
            method: "GET",
            login: true,
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function openTimedBagForce() {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/timedbag/forceOpen",
            method: "GET",
            login: true,
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

function wechateDcrypt(iv, encryptedData) {
    return new Promise((resolve, reject) => {
        window.platform.request({
            url: baseUrl + "/wechat/decrypt",
            method: "POST",
            login: true,
            data: {iv, encryptedData},
            success: function(res) {
                cc.log(res);
                if (res.data.code == 0) {
                    resolve(res.data.data);
                } else {
                    reject(res.data.code);
                }
            },
            fail: function(e) {
                cc.error(e);
                reject(e);
            }
        });
    });
}

module.exports = {
    /**
     * 基地址
     */
    baseUrl,
    /**
     * 获取游戏设置
     */
    fetchSetting,
    /**
     * 获取关卡数据
     */
    fetchLevelCode,
    /**
     * 开始闯关
     */
    startGame,
    /**
     * 闯关成功
     */
    gameSuccess,
    /**
     * 跳过关卡
     */
    gameSkip,
    /**
     * 闯关成功后分享到群获取奖励
     */
    gameShareToGroupPrize,
    /**
     * 获取用户消息
     */
    getUserMessage,
    /**
     * 用户消息确认
     */
    confirmUserMessage,
    /**
     * 购买皮肤
     */
    buyTheme,
    /**
     * 获取抽奖机状态
     */
    getLotteryDrawState,
    /**
     * 抽奖分享
     */
    shareLotteryDraw,
    /**
     * 抽奖
     */
    runLotteryDraw,
    /**
     * 强制抽奖
     */
    runLotteryDrawForce,
    /**
     * 用户是否可打开礼包
     */
    canOpenTimedBag,
    /**
     * 打开礼包
     */
    openTimedBag,
    /**
     * 强制打开礼包
     */
    openTimedBagForce,
    /**
     * 微信数据解密
     */
    wechateDcrypt
}