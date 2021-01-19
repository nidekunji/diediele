let OpenData = require('./OpenData');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        console.log("=======opendata onload=========！！！！！！！！！！！！！！！");
        wx.onMessage(data => {
            switch (data.massage) {
                case 'showFriendRank': {
                    console.log('=========加载等级好友数据=======');
                    cc.director.loadScene("LevelFriendRank");
                    break;
                }
                case 'hideFriendRank': {
                    cc.director.loadScene("Empty");
                    break;
                }
                case 'showGroupRank': {
                    //this.getGroupRank(data.shareTicket);
                    break;
                }
                case 'showUserInfo' : {
                    OpenData.openid = data.openid;
                    cc.director.loadScene("UserInfo", function() {
                        console.log("scene launched");
                    });
                    break;
                }
                case 'hideUserInfo' : {
                    cc.director.loadScene("Empty");
                    break;
                }
                default: break;
            }
        });
    },

    start () {
        
    }

    /*
    getUserData() {
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: "zh_CN",
            success: function(res) {
                console.log(res.data);
            },
            fail: function(e) {
                console.error(e);
            }
        });
        wx.getUserCloudStorage({
            keyList: ['avatarUrl', 'nickname', 'openid', 'level'],
            success(res) {
                console.log("user cloud storage", res);
            },
            fail(e) {
                console.error("获取当前用户数据失败", e);
            }
        });
    },

    setGroupRank () {
        
    },
    getGroupRank (shareTicket) {
        var self = this;
        wx.getGroupCloudStorage({
            shareTicket: shareTicket,
            keyList: ['avatarUrl', 'nickname', 'openid', 'level'],
            success() {
                self.setGroupRank();
            }
        });
    }
    */
});
