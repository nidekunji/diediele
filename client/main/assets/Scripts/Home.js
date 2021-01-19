/**
 * @author kunji
 * @description 开始页
 * @time 2020.5.27
 */
var TimedBag = require('./TimedBag');
const {HP_TYPE,PROP_TYPE} = require('../Utils/Constants');
var Prop = require('../Utils/Prop');
const UI = require('../Utils/UI');
cc.Class({
    extends: cc.Component,

    properties: {
      //  timedBag: TimedBag
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (!window.HTTP) {
            window.HTTP = require('../Utils/HTTP');
            window.Tools = require('../Utils/tools');
            window.WxTools = require('../Utils/WxTools');
        }
        this.afterSettingInited = cc.game.on("setting inited", () => {
            if (window.guideManager && window.guideManager.enabled && !this.guideHandled) {
                var {GUIDE_STEPS} = require('../Utils/Constants');
                window.guideManager.after(GUIDE_STEPS.START_GAME_TOUCH, () => {
                    this.startGame();
                });
                this.guideHandled = true;
            }
        });
    },
    onDestroy () {
        cc.game.off("setting inited", this.afterSettingInited);
        window.platform.hideGameClubButton();
    },

    start () {
        this.scheduleOnce(function() {
            if (window.platform) {
                window.platform.showGameClubButton();
            }
        }, 0.5);
    },

    /**
     * 开始游戏
     */
    startGame () {
     
        if (window.userInfo.health >= HP_TYPE.PLAY_SUB_HP) {
            console.log('======扣体力=========');
            Tools.commonChangeHp(-HP_TYPE.PLAY_SUB_HP);
        } else {
            UI.showLessHp({
                title: "提示",
                content: "体力不足，分享给好友获取体力",
                showCancel: true,
                success: () => {
                    console.log('点击分享');
                }
            });
            return;
        }
      
      this.hpAction(function () {
        window.level = window.userInfo.level+1;
        window.skipSence = 'Main';
        cc.director.loadScene("Loading");
      });
    },
   hpAction(succ) {
    let hpNode = cc.find("Canvas/hpimg");
    let hpx = hpNode.x;
    let hpy = hpNode.y;
    let startBtn = cc.find('Canvas/btnstart');
    let time1 = 0.5;
    let time2 = 0.6;
    let move = cc.sequence(
        cc.spawn(cc.scaleTo(time1, 1.2, 1.2),
        cc.moveTo(time2, startBtn.x + startBtn.width/3, startBtn.y)),
        cc.callFunc(function (){
            hpNode.x = hpx;
            hpNode.y = hpy;
            hpNode.scale = 1;
            succ && succ();
        })
    );
    hpNode.runAction(move);
   },
    

    // update (dt) {},
});
