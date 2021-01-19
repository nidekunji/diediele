/**
 * @author kunji
 * @description 主页
 * @time 2020.5.25
 */
var TimedBag = require('./TimedBag');

cc.Class({
    extends: cc.Component,

    properties: {
        timedBag: TimedBag
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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
        cc.director.loadScene("ChooseLevel");
    },
    /**
     * 分享
     */
    share() {
        window.platform.share({
            success() {}
        });
    }

    // update (dt) {},
});
