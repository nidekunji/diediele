// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Service = require('../Utils/Service');
var Prop = require('../Utils/Prop');
var PrizeModal = require('./PrizeModal');

cc.Class({
    extends: cc.Component,

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
        countdown: cc.Label,
        prizeModal: PrizeModal
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.countdownState = 0;
    },
    start () {
        if (window.userInfo) {
            this.setTimedBagStatus();
        } else {
            this.afterLogged = cc.game.on("logged", this.setTimedBagStatus.bind(this));
        }
        this.afterSettingInited = cc.game.on("setting inited", () => {
            if (window.guideManager && window.guideManager.enabled && !this.guideHandled) {
                var {GUIDE_STEPS} = require('../Utils/Constants');
                window.guideManager.after(GUIDE_STEPS.TIMEDBAG_TOUCH, () => {
                    this.open();
                });
                window.guideManager.after(GUIDE_STEPS.TIMEDBAG_PRIZE, () => {
                    this.prizeModal.hide();
                });
                this.guideHandled = true;
            }
        });
        this.node.on("countdownFinished", () => {
            this.setTimedBagStatus();
        });
    },
    onDestroy () {
        cc.game.off("logged", this.afterLogged);
        cc.game.off("setting inited", this.afterSettingInited);
        if (this.countdownTimer) {
            clearTimeout(this.countdownTimer);
        }
    },

    doCountDown() {
        if (this.timeLeft >= 1) {
            this.timeLeft--;
        } else {
            this.stopCountDown();
            return;
        }
        var minute = Math.floor(this.timeLeft / 60);
        minute = minute >= 10 ? minute.toString() : "0" + minute.toString();
        var second = parseInt(this.timeLeft % 60);
        second = second >= 10 ? second.toString() : "0" + second.toString();
        this.countdown.string = minute + " : " + second;
        this.countdownTimer = setTimeout(() => {
            this.doCountDown();
        }, 1000);
    },

    stopCountDown() {
        this.countdown.string = "";
        if (this.countdownTimer) {
            clearTimeout(this.countdownTimer);
        }
        this.node.emit("countdownFinished");
    },

    startAnimation () {
        this.animationAction = cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.2), cc.scaleTo(0.5, 1)));
        this.node.runAction(this.animationAction);
    },

    stopAnimation () {
        if (this.animationAction) {
            this.node.stopAction(this.animationAction);
            this.node.setScale(1, 1);
        }
    },

    setTimedBagStatus () {
        Service.canOpenTimedBag().then(res => {
            this.canOpen = res.canOpen;
            this.timeLeft = res.timeLeft;
            this.frequency = res.frequency;
            if (this.canOpen) {
                this.startAnimation();
            } else {
                this.stopAnimation();
            }
            if (this.timeLeft > 0) {
                if (this.countdownTimer) {
                    clearTimeout(this.countdownTimer);
                }
                this.doCountDown();
            }
        });
    },

    openTimedBag () {
        this.canOpen = false;
        this.countdownState = 0;
        Service.openTimedBag().then(res => {
            if (res.prize) {
                this.timeLeft = this.frequency;
                Prop.prize(res.prize);
                // 提示奖励
                this.prizeModal.prize = res.prize;
                this.prizeModal.show();
                if (window.guideManager && window.guideManager.enabled) {
                    window.guideManager.next();
                }
            }
            if (res.timeLeft > 0) {
                this.timeLeft = res.timeLeft;
            }
        })
        .then(() => {
            this.setTimedBagStatus();
        })
        .catch((e) => {
            cc.error(e);
            this.setTimedBagStatus();
        });
    },

    openTimedBagForce () {
        this.canOpen = false;
        this.countdownState = 0;
        Service.openTimedBagForce().then(res => {
            if (res.prize) {
                this.timeLeft = this.frequency;
                Prop.prize(res.prize);
                // 提示奖励
                this.prizeModal.prize = res.prize;
                this.prizeModal.show();
            }
            if (res.timeLeft > 0) {
                this.timeLeft = res.timeLeft;
            }
        })
        .then(() => {
            this.setTimedBagStatus();
        })
        .catch((e) => {
            cc.error(e);
            this.setTimedBagStatus();
        });
    },

    open () {
        if (this.canOpen) {
            this.openTimedBag();
        } else {
            window.platform.share({
                success: (res) => {
                    console.log(res);
                    this.openTimedBagForce();
                }
            });
        }
    }
    /*
    update (dt) {
        
    },
    */
});
