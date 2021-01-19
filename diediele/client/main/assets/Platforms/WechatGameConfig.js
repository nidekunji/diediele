const {baseUrl} = require('../Utils/Service');

module.exports = {
    loginOptions: {
        method: 'POST',
        success: function(){},
        fail: function(){},
        loginUrl: baseUrl + "/login"
    },
    remoteFontFileUrl: "https://huanlewanyiba-1256658787.cos.ap-guangzhou.myqcloud.com/FZPWJW--GB1-0.TTF",
    shareConfig: {
        withShareTicket: true,
        imageUrl: "https://huanlewanyiba-1256658787.cos.ap-guangzhou.myqcloud.com/share.jpg",
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
    },
    gameClubButtonConfig: {
        type: 'image',
        image: 'https://huanlewanyiba-1256658787.cos.ap-guangzhou.myqcloud.com/youxiquan.png',
        style: {
            left: 0,
            top: 628,
            width: 86,
            height: 78
        }
    }
}