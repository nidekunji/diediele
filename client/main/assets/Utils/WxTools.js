/**
 * @author kunji
 * @description 微信api工具
 * @time 2020.5.31
 */
var launchOptions;
var gameClubButton;
var openDataTexture;
var openDataContext;
var shareList;
const config = require("WechatGameConfig");
function init(afterLogin) {
    cc.log("init wechat game");
    // 获取启动参数
    launchOptions = wx.getLaunchOptionsSync();
    
    cc.log("launch options:", launchOptions);
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
    //登录
    login(afterLogin);
    // 下载远程字体文件
    // wx.downloadFile({
    //     url: config.remoteFontFileUrl,
    //     header: {
    //         "Content-Type": "application/octet-stream"
    //     },
    //     filePath: "",
    //     success: function(res) {
    //         cc.log(res.tempFilePath);
    //         wx.loadFont(res.tempFilePath);
    //     },
    //     fail: function(e) {
    //         cc.error(e);
    //     }
    // })

    // 监听小游戏回到前台事件
    wx.onShow(() => {
       // cc.log("onshow options:", options);
        // 启用物理系统
        cc.director.getPhysicsManager().enabled = true;
        wx.triggerGC();
     
        if (shareList) {
            let _now = Tools.getLocalTs();
        let diff = _now - window.ONSHARESTARTTS;
        if (diff >= 3) {
            shareList.succ && shareList.succ();
        } else {
            wx.showToast({title:"分享失败！"});
            shareList.fail && shareList.fail();
        }
        }
        shareList = null;
    });
    // 监听小游戏隐藏到后台事件
    wx.onHide(() => {
        // 禁用物理系统
        cc.director.getPhysicsManager().enabled = false;
        wx.triggerGC();
        wx.setStorageSync('userInfo', window.userInfo);
        setUserCloudStorage();
    });

    // 创建游戏圈按钮
    // var gameClubButtonConfig  = Object.assign({}, config.gameClubButtonConfig);
    // var scale = window.systemInfo.screenWidth / cc.winSize.width;
    // gameClubButtonConfig.style.top *= scale;
    // gameClubButtonConfig.style.left *= scale;
    // gameClubButtonConfig.style.width *= scale;
    // gameClubButtonConfig.style.height *= scale;
    // gameClubButton = wx.createGameClubButton(gameClubButtonConfig);
    
    /**
     * 初始化开放数据域纹理
     */
    openDataTexture = new cc.Texture2D();
    openDataContext = wx.getOpenDataContext();

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
}

/**
 * 
 * @param {*} afterLogin 登录成功
 */
function login(afterLogin) {
           // 构造请求头，包含 code
            wx.showLoading({
                title: '正在登录',
            });
            wx.login({
                success: function (loginResult) {
                    console.log(loginResult, '========微信接口登录======');
                    let succ = function (res) {
                        cc.log("login result:", res);
                        var data = res.data;
                        // 成功地响应会话信息
                        if (res.code === 0  && data && data.skey) {
                            wx.hideLoading();
                            if (data.userinfo) {//用户信息
                                setSession(data.skey);
                                if (data.userinfo.themes) {
                                    data.userinfo.themes = data.userinfo.themes.split(",");
                                } else {
                                    data.userinfo.themes = [];
                                }
                                window.userInfo = Object.assign(window.userInfo || {}, data.userinfo);
                                console.log(window.userInfo, 'window.userInfo');
                                afterLogin && afterLogin(data);
                            } else {
                                var errorMessage = '登录失败(' + data.error + ')：' + (data.message || '未知错误');
                                var noSessionError = new LoginError('ERR_LOGIN_SESSION_NOT_RECEIVED', errorMessage);
                                showModal('提示', errorMessage);
                            }
                        } else {
                            // 没有正确响应会话信息
                            var noSessionError = new LoginError('ERR_LOGIN_SESSION_NOT_RECEIVED', JSON.stringify(data));
                            console.log(noSessionError, 'noSesionError');
                            showModal('提示', noSessionError);
                        }
                    };
                    // 请求服务器登录地址，获得会话信息
                    Tools.login(loginResult.code, succ);
                },
    
                fail: function () {
                    wx.showToast({
                        title: '微信登录失败，请检查网络状态',
                        icon: 'none'
                    });
                }
            });
}

/**
 * 
 * @param {*} title 
 * @param {*} content 
 * @param {*} showCancel 
 * @param {*} success 
 * @param {*} fail 
 */
function showModal(title, content, showCancel, success,fail) {
    wx.showModal({
        title: title,
        content: content,
        showCancel: typeof showCancel !== "undefined" ? showCancel : true,
        success: typeof success !== "undefined" ? success : noop,
        fail: typeof fail !== "undefined" ? fail : noop
    });
}
 /**
 * 分享
 * {title, imageUrl, query}
 */
  
function share(succ, fail) {
        wx.shareAppMessage({
                withShareTicket: true,
                imageUrl: "https://ddl.dianjinyouxi.com/res/share.jpg",
                title: "推荐一款超好玩的游戏",
                query: "",
                success:function(){
                    console.log("wxshare success");
                },
                fail:function(){
                    console.log("wxshare fail");
                },
                complete:function(){
                    console.log("wxshare complete");
                }
            });
        window.ONSHARESTARTTS = Tools.getLocalTs();
        shareList = {
            succ: succ,
            fail: fail
        }
}
    /**
 * 获取最新的开放数据域纹理
 */
let id = 1;
function getOpenDataTexture() {
    if (!openDataTexture) {
        return;
    }
    var sharedCanvas = openDataContext.canvas;
    openDataTexture.initWithElement(sharedCanvas);
    openDataTexture.handleLoadedTexture();
    if (id == 1) {
        console.log(openDataTexture, 'openDatatexture');
    }
    id += 1;
    return openDataTexture;
}
 /**
 * 检查会话是否过期
 * @param {Boolean} forceRefresh 
 * @returns {Promise}
 */
function checkSession(forceRefresh = false) {
        if (forceRefresh) {
            clearSession();
            return login()
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
                if (!getSession()) {
                    login()
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
                            clearSession();
                            login()
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
}
  /**
     * 设置会话
     * @param {String} session 
     */
function setSession(session) {
    //  wx.setStorageSync(this.session_key, session);
        window.session = session;
}
/**
 * 清除会话
 */
function  clearSession() {
    window.session = null;
   // wx.removeStorageSync(session_key);
}
/**
 * 获取会话
 */
function getSession() {
    return window.session;
    return wx.getStorageSync(session_key) || null;
}
 /**
 * 清除会话
 */
function clearSession() {
    window.session = null;
  //  wx.removeStorageSync(session_key);
}
function setStorageSync(key, data) {
    wx.setStorageSync(key, data);
}
function setStorage({key, data, success, fail, complete}) {
    wx.setStorageSync({
        key,
        data,
        success: success ? success: noop,
        fail: fail ? fail: noop,
        complete: complete ? complete : noop
    });
}
function getStorageSync(key) {
    return wx.getStorageSync(key);
}
function getStorage({key, success, fail, complete}) {
    wx.getStorage({
        key,
        success: success ? success: noop,
        fail: fail ? fail: noop,
        complete: complete ? complete : noop
    });
}
function createImage() {
    return wx.createImage();
}
function loadImage(sprite, url) {
    let image = wx.createImage();
    image.onload = function () {
        let texture = new cc.Texture2D();
        texture.initWithElement(image);
        texture.handleLoadedTexture();
        sprite.spriteFrame = new cc.SpriteFrame(texture);
    };
    image.src = url;
}
function triggerGC() {
    wx.triggerGC();
}
/**
 * 
 * @param {*} param0 激励广告 
 */
function createRewardedVideoAd({complete, cancel, fail}) {
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
}
/**
 * 显示游戏圈按钮
 */
function showGameClubButton () {
    gameClubButton.show();
}
/**
 * 隐藏游戏圈按钮
 */
function hideGameClubButton () {
    gameClubButton.hide();
}
  /**
     * 上传排行榜信息
     */
function  setUserCloudStorage() {
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
            console.log("setUserCloudStorage success");
        },
        fail(e) {
            cc.error(e);
        },
        complete() {}
    });
}
/**
 * 保存用户信息
 */
function setUserInfoStorage() {
        wx.setStorageSync('userInfo', window.userInfo);
}
/**
 * 显示好友排行榜
 */
function showFriendRank() {
    console.log('显示好友排行榜');
    wx.getOpenDataContext().postMessage({
        type: 'showFriendRank'
    });
    // openDataContext.postMessage({
    //     type: 'showFriendRank'
    // });
}
/**
 * 隐藏好友排行榜
 */
function hideFriendRank() {
    wx.getOpenDataContext().postMessage({
        type: 'hideFriendRank'
    });
    // openDataContext.postMessage({
    //     type: 'hideFriendRank'
    // })
}
/**
 * 显示群排行榜
 * @param {String} shareTicket 
 */
function showGroupRank(shareTicket) {
        openDataContext.postMessage({
            type: 'showGroupRank',
            shareTicket: shareTicket
        })
}
/**
 * 展示用户信息
 * @param {String} openid 
 */
function showUserInfo(openid) {
    openDataContext.postMessage({
        type: 'showUserInfo',
        openid: openid
    });
}
/**
 * 隐藏用户信息
 */
function hideUserInfo() {
    openDataContext.postMessage({
        type: 'hideUserInfo'
    });
}
function getHelpInfo() {
        console.log(launchOptions, 'launchOptions');
        const {help_seeker_id, level} = launchOptions.query;
        if (help_seeker_id) {
            return {
                help_seeker_id: help_seeker_id ? parseInt(help_seeker_id) : help_seeker_id,
                level: level ? parseInt(level) : level
            };
        } else {
            return {};
        }
        
}
function clearHelpInfo() {
        if (launchOptions.query) {
            launchOptions.query.help_seeker_id = null;
            launchOptions.query.level = null;
        }
}
    
function showToast({title, icon, image, duration, success, fail, complete}) {
        wx.showToast({
            title, icon, image,
            duration: duration ? duration : 1000,
            success: success ? success : noop,
            fail: fail ? fail : function(e){cc.error(e)},
            complete: complete ? complete : noop
        });
}
function showLoading({title = '', mask = false, success = noop, fail = noop, complete = noop}) {
    wx.showLoading({
        title,
        mask,
        success,
        fail,
        complete
    });
}
function hideLoading({success = noop, fail = noop, complete = noop}) {
        wx.hideLoading({
            success,
            fail,
            complete
        });
}
function createAuthorizeBtn(btnNode, complete){
            let btnSize = cc.size(btnNode.width+10,btnNode.height+10);
            let frameSize = cc.view.getFrameSize();
            let winSize = cc.director.getWinSize();
            let btnAuthorize;
            // console.log("winSize: ",winSize);
            // console.log("frameSize: ",frameSize);
            //适配不同机型来创建微信授权按钮
            let left = (winSize.width*0.5+btnNode.x-btnSize.width*0.5)/winSize.width*frameSize.width;
            let top = (winSize.height*0.5-btnNode.y-btnSize.height*0.5)/winSize.height*frameSize.height;
            let width = btnSize.width/winSize.width*frameSize.width;
            let height = btnSize.height/winSize.height*frameSize.height;
    
            // console.log("button pos: ",cc.v2(left,top));
            // console.log("button size: ",cc.size(width,height));
    

            btnAuthorize = wx.createUserInfoButton({
                type:"text",
                text:"",
                style:{
                    left:left,
                    top:top,
                    width:width,
                    height:height,
                    lineHeight:0,
                    backgroundColor:"",//透明
                    color:"#ffffff",
                    textAlign:'center',
                    fontSize:16,
                    borderRadius:4,
                },
            });
    
        btnAuthorize.onTap((uinfo) => {
       // console.log("onTap uinfo: ",uinfo);
        if (uinfo.userInfo) {
       //     console.log("wxLogin auth success");
            complete && complete();
        }else {
        //    console.log("wxLogin auth fail");
           // wx.showToast({title:"授权失败"});
            complete && complete();
        }
        });
}
function customerService() {
    if (!wx.openCustomerServiceConversation) {
        return;
    }
    wx.openCustomerServiceConversation({
        showMessageCard: true,
        
        sendMessageImg: "http://pic2.cxtuku.com/00/07/43/b077da336c80.jpg",
        
        success: function (data) {
        
        console.log("success =", data)
        
        },
        
        fail: function (data) {
        
        console.log("fail =", data)
        
        },
        
        complete: function (data) {
        
        console.log("complete =", data)
        
        }
        
        })
}
module.exports = {
    hideLoading,
    showLoading,
    showFriendRank,
    hideFriendRank,
    hideUserInfo,
    showUserInfo,
    getHelpInfo,
    clearHelpInfo,
    showToast,
    init,
    showModal,
    showGameClubButton,
    hideGameClubButton,
    createRewardedVideoAd,
    triggerGC,
    loadImage,
    share,
    setUserCloudStorage,
    setUserInfoStorage,
    showGroupRank,
    getOpenDataTexture,
    createAuthorizeBtn,
    customerService
};