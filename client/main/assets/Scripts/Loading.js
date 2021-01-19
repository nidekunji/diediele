/**
 * @author kunji
 * @description 加载页
 * @time 2020.6.1
 */
const {LODING_ERR} = require('../Utils/Constants');
cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default:null,
            type: cc.ProgressBar,
        },
        progressTxt: {
            default:null,
            type: cc.Label,
        },
        skipStatus: false,
    },

    onLoad () {
        if (!window.skipSence) {
            window.skipSence = 'Home';
        }
        this.loadingDiceScene();
    },

    start () {

    },
    skipScene() {
        cc.director.loadScene(window.skipSence, function (err) {
            if (err) {
                cc.Canvas.instance.scheduleOnce(function () {
                    
                    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                            wx.showModal({
                                title: LODING_ERR.title,
                                content: LODING_ERR.content,
                                success: (res) => {
                                    if (res.confirm) {
                                        this.loadingDiceScene();
                                    } else {
                                        wx.exitMiniProgram();
                                    }
                                },
                            });
                    } else {
                        console.log(err, 'err load scence');
                    }
                }, 0);
            } 
        });
    },
    loadingDiceScene() {
        cc.loader.onProgress = function (completedCount, totalCount, item){
            //先开监听
          this.progressBar.progress = completedCount/totalCount;
          this.progressTxt.string = Math.floor(completedCount/totalCount * 100) + "%";
      }.bind(this); 
      let self = this;
      cc.director.preloadScene(window.skipSence, function () {
          cc.log("加载成功");
          self.skipScene();
          cc.loader.onProgress = null;
      });
    },

    // update (dt) {},
});
