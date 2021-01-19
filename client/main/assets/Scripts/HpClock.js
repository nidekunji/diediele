/**
 * @author kunji
 * @description 体力倒计时
 * @time 2020.5.29
 */
const {HP_TYPE,PROP_TYPE} = require('../Utils/Constants');
cc.Class({
    extends: cc.Component,

    properties: {
        maxHp: 5,
        recoverTime: 60,
        min: 0,
        sec: 0,
    },
     //设置倒计时的时间
     setClockTime(time) {
        if(typeof time == 'number'){
            if(!isNaN(time)){
                this.min = Math.floor(time / 60);
                this.sec = Math.floor(time % 60);
            } 
        }
    },
    //停止恢复体力倒计时,正常情况下
    stopClock(addHp = true) {
        if (this.node == null) {
            return;
        }
        if (window.recoverHpIng) {
            window.recoverHpIng = false;
            if(addHp) {
                console.log('======停止定时器=========');
            } else {
                console.log('======中途定时器=========');
                if (window.userInfo.health >= this.maxHp) {
                    window.recoverTime = 0;
                }
            }
            this.unschedule(this.funUp);
            if (addHp) {
                Tools.commonChangeHp(HP_TYPE.CLOCK_ADD_HP);
            }
            if (window.userInfo.health >= HP_TYPE.MAX_HP) {
                if (!this.fullTips(true)){
                    this.node.getComponent(cc.Label).string = '已满';
                } else {
                    this.node.getComponent(cc.Label).string = '';
                }
            } 
        }
    },
    funUp () {
        if (this.min > 0 || this.sec > 0) {
            if (this.sec == 0 && this.min > 0) {
                this.sec = 60;
                this.min -= 1;
            } 
            this.sec--;
            window.hpRecoverTime--;
            let gapS = this.sec < 10 ? '0' : '';
            let s = this.sec > 0 ? this.sec : 0;
            this.node.getComponent(cc.Label).string = '0' + this.min + ':' + gapS + s;
        } else {
            window.hpRecoverTime = 0;
            this.stopClock();
        }
    },
    

    //开始恢复体力倒计时
    startClock() {
        if (this.node == null) {
            return;
        }
        let newTime = 1;
        this.schedule(this.funUp, newTime);
    },

    onLoad () {
        window.recoverHpIng = false;
        cc.game.on("hp_recover_clock",  ()=> {
            if (window.userInfo.health >= 5) {
                return;
            }
            if (!window.hpRecoverTime) {
                window.hpRecoverTime = this.recoverTime;
            } 

            window.recoverHpIng = true;
            this.fullTips(false);
            this.setClockTime(window.hpRecoverTime);
            this.startClock();
        });
        cc.game.on('hp_stopRecover_clock',  ()=> {
            if (window.recoverHpIng) {
                this.stopClock(false);
            }
        });
          
    },
    onDestroy () {
       // this.stopClock(false);
    },

    start () {
        let self = this;
        self.fullTips(false);
        Tools.delay(function () {
            if (!self.node) {
                return;
            }
            if (window.hpRecoverTime && !window.recoverHpIng && window.userInfo.health < HP_TYPE.MAX_HP)  {
                window.recoverHpIng = true;
                self.setClockTime(window.hpRecoverTime);
                self.startClock();
            }  else {
                if (!self.fullTips(true)){
                    self.node.getComponent(cc.Label).string = '已满';
                } else {
                    self.node.getComponent(cc.Label).string = '';
                }

            }
        }, 0);

    },
    fullTips(value) {
        let fullNode = cc.find('Canvas/prop_bg_mask/hp_bg/full_txt');
        if (fullNode) {
            fullNode.active = value;
            return true;
        } 
        return false;
    }
    // update (dt) {},
});
