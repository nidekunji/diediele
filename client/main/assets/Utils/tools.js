var crypto = require("crypto");
const {PROP_TYPE} = require('./Constants');
var Prop = require('./Prop');
let deepCopy = function (obj, target = null) {
    let output = target || (obj instanceof Array ? [] : {});
    for (let key in obj) {
        if (!(obj[key] instanceof cc.Node) && (obj[key] instanceof Object &&
                typeof obj[key] != 'function') ||
            obj[key] instanceof Array) {
            output[key] = deepCopy(obj[key], output[key])
        } else {
            output[key] = obj[key];
        }
    }

    return output;
};
let getLocalTs = function (isSecond = true) {
    let now = +new Date();
    return isSecond ? Math.floor(now / 1000) : now;
};

//登录
function login(code = 'simulator_test',succ) {
    HTTP.sendRequest("login", 'Post', {code: code}, (ret) => {
        console.log('=======登录情况========',ret);
        succ && succ(ret);
    });
}
//获取用户设置
function fetchSetting(succ) {
    HTTP.sendRequest("setting/all", 'Get', {},(ret) => {
        console.log('=====获取用户设置=========');
        succ && succ(ret);
    });
} 
//获取关卡配置
function fetchLevelCode(lv, succ) {
    HTTP.sendRequest("level/code?lvl=" + lv, 'Get', {},(ret) => {
        console.log('========获取关卡配置========', ret);
        succ && succ(ret);
    });
}
//开始游戏
function startGame(level, help_seeker_id, succ) {
    HTTP.sendRequest("game/start", 'Post', {level: level, help_seeker_id: help_seeker_id},(ret) => {
        console.log('========开始游戏========', ret);
        succ && succ(ret);
    });
}
//获取用户信息
function getUserMessage(succ, scene = 'scene') {
    HTTP.sendRequest("user/message?scene=" + scene, 'Get', {},(ret) => {
        console.log('========获取用户信息========', ret);
        succ && succ(ret);
    });
}
//改变体力数值
function changeHpNum(amount, succ) {
    HTTP.sendRequest("user/health" , 'Post', {amount: amount},(ret) => {
        console.log('=======增加或减少体力========', ret);
        succ && succ(ret);
    });
}
//闯关成功
function gameSuccess(level, help_seeker_id, succ) {
    HTTP.sendRequest("game/success" , 'Post', {level: level, help_seeker_id: help_seeker_id},(ret) => {
        console.log('=======闯关成功========', ret);
        succ && succ(ret);
    });
}
//跳过关卡
function gameSkip(level, succ) {
    HTTP.sendRequest("game/skip" , 'Post', {level: level},(ret) => {
        console.log('=======跳过关卡========', ret);
        succ && succ(ret);
    });
}
//群分享奖励
function gameShareToGroupPrize(succ) {
    HTTP.sendRequest("game/shareToGroupPrize", 'Get', {},(ret) => {
        console.log('========分享到群的奖励========', ret);
        succ && succ(ret);
    });
}
//确认用户信息
function confirmUserMessage(msgid, succ) {
    HTTP.sendRequest("user/message/confirm" , 'Post', {msgid: msgid},(ret) => {
        console.log('=======确认用户========', ret);
        succ && succ(ret);
    });
}
//购买皮肤
function buyTheme(theme_id, succ) {
    HTTP.sendRequest("theme/buy" , 'Post', {theme_id: theme_id},(ret) => {
        console.log('=======购买皮肤========', ret);
        succ && succ(ret);
    });
}
//获取抽奖状态
function getLotteryDrawState(succ) {
    HTTP.sendRequest("lotterydraw/state", 'Get', {},(ret) => {
        console.log('========获取抽奖状态========', ret);
        succ && succ(ret);
    });
}
//抽奖
function runLotteryDraw(succ) {
    HTTP.sendRequest("lotterydraw/run", 'Get', {},(ret) => {
        console.log('========抽奖========', ret);
        succ && succ(ret);
    });
}
//抽奖分享
function shareLotteryDraw(succ) {
    HTTP.sendRequest("lotterydraw/share", 'Get', {},(ret) => {
        console.log('========抽奖分享========', ret);
        succ && succ(ret);
    });
}
//强制抽奖
function runLotteryDrawForce(succ) {
    HTTP.sendRequest("lotterydraw/forceRun", 'Get', {},(ret) => {
        console.log('========强制抽奖========', ret);
        succ && succ(ret);
    });
}
//用户可否打开礼包
function canOpenTimedBag(succ) {
    HTTP.sendRequest("timedbag/canOpen", 'Get', {},(ret) => {
        console.log('========用户可否打开礼包========', ret);
        succ && succ(ret);
    });
}
//打开礼包
function openTimedBag(succ) {
    HTTP.sendRequest("timedbag/open", 'Get', {},(ret) => {
        console.log('========用户打开礼包========', ret);
        succ && succ(ret);
    });
}
//强制用户打开礼包
function openTimedBagForce(succ) {
    HTTP.sendRequest("timedbag/forceOpen", 'Get', {},(ret) => {
        console.log('========强制用户打开礼包========', ret);
        succ && succ(ret);
    });
}
//微信数据解密
function wechateDcrypt(iv, encryptedData, succ) {
    HTTP.sendRequest("wechat/decrypt" , 'Post', {iv:iv, encryptedData: encryptedData},(ret) => {
        console.log('=======购买皮肤========', ret);
        succ && succ(ret);
    });
}
//调用地方多
//
function commonChangeHp(amount) {
    Prop.consume(PROP_TYPE.HP, amount);
    Tools.changeHpNum(amount);
}
function delay(cb, time = 0){
    cc.Canvas.instance.scheduleOnce(() => {
        cb && cb();
    }, time)
}


function isFromWx(){
    return cc.sys.platform === cc.sys.WECHAT_GAME;
}

function isFromBrowser(){    
    return cc.sys.platform === cc.sys.DESKTOP_BROWSER;
}

function getCache(key){
    return cc.sys.localStorage.getItem(key) || '';
}

function setCache(key, val){
    if(!key){
        throw new Error('key不能为空');
    }
    if(Object.is(val, undefined) || Object.is(val, null)){
        val = '';
    }
    if(typeof(val) === 'object'){
        val = JSON.stringify(val);
    }    
    return cc.sys.localStorage.setItem(key, val);
}

function delCache(key){
    return cc.sys.localStorage.removeItem(key);
}


module.exports = {
    deepCopy,
    getLocalTs,
    delay,    
    isFromWx,
    isFromBrowser,
    getCache,
    setCache,
    delCache,
    /**
     * 登录
     */
    login,
    /**
     * 改变体力的值
     */
    changeHpNum,
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
    wechateDcrypt,
    /**
     * 增加/减少体力
     */
    commonChangeHp
};