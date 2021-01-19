const Service = require('../Utils/Service');
const Prop = require('../Utils/Prop');
var PrizeModal = require('./PrizeModal');
const {GUIDE_STEPS} = require('../Utils/Constants');

cc.Class({
    extends: cc.Component,

    properties: {
        spinBtn: {
            default: null,      // The default value will be used only when the component attachin                    // to a node for the first time
            type:cc.Button,     // optional, default is typeof default
            visible: true,      // optional, default is true
            displayName: 'SpinBtn', // optional
        },
        wheel:{
            default:null,
            type:cc.Sprite
        },
        highline:{
            default:null,
            type:cc.Sprite
        },
        maxSpeed:{
            default:10,
            type:cc.Float,
            max:20,
            min:5,
        },
        duration:{
            default:3,
            type:cc.Float,
            max:5,
            min:1,
            tooltip:"减速前旋转时间"
        },
        acc:{
            default:0.1,
            type:cc.Float,
            max:0.5,
            min:0.01,
            tooltip:"加速度"
        },
        targetID:{
            default:0,
            type:cc.Integer,
            max:5,
            min:0,
            tooltip:"指定结束时的齿轮"
        },
        maxShareTimes:{
            default: 3,
            type: cc.Integer,
            min: 0,
            max: 10,
            tooltip: "最大分享次数"
        },
        springback:{
            default:true,
            tooltip:"旋转结束是否回弹"
        },
        effectAudio:{
            default:null,
            type:cc.Texture2D
        },
        prizeModal: PrizeModal,
        prizesBox: cc.Node,
        shareButton: cc.Button,
        startAudioSource: cc.AudioSource,
        stopAudioSource: cc.AudioSource
    },

    // use this for initialization
    onLoad: function () {
        cc.log("....onload");
        this.wheelState = 0;    
        this.curSpeed = 0;
        this.spinTime = 0;                   //减速前旋转时间
        this.gearNum = 6;
        this.defaultAngle = (-1) * 360/this.gearNum/2;        //修正默认角度
        this.gearAngle = 360/this.gearNum;   //每个齿轮的角度
        this.wheel.node.rotation = this.defaultAngle;
        this.finalAngle = 0;                   //最终结果指定的角度
        this.effectFlag = 0;                 //用于音效播放

        if(!cc.sys.isBrowser)
        {
            //cc.loader.loadRes('Sound/game_turntable', function(err,res){if(err){cc.log('...err:'+err);}});
        }
        
        this.spinBtn.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            cc.log("begin spin");
            if(this.wheelState !== 0)
            {
                 return;
            }
            this.spinBtn.node.active = false;
            Service.runLotteryDraw()
                .then((res) => {
                    this.setLotteryDrawState();
                    if (res.prizeID) {
                        this.startAudioSource.play();
                        this.targetID = res.prizeID - 1;
                        this.decAngle = 2*360;  // 减速旋转两圈
                        this.wheelState = 1;
                        this.curSpeed = 0;
                        this.spinTime = 0;
                    }
                })
                .catch(error => {
                    cc.error(error);
                    this.spinBtn.node.active = true;
                });
            // var act = cc.rotateTo(10, 360*10);
            // this.wheel.node.runAction(act.easing(cc.easeSineInOut()));
        });

        if (window.userInfo) {
            this.setLotteryDrawState();
        } else {
            this.afterLogged = cc.game.on("logged", this.setLotteryDrawState.bind(this));
        }
        let self = this;
        this.afterSettingInited = cc.game.on("setting inited", () => {
            
            if (!this.prizesInited) {
                this.initPrizes();
            }
            
            if (window.guideManager && window.guideManager.enabled && !this.guideHandled) {
                window.guideManager.after(GUIDE_STEPS.LOTTERY_DRAW_TOUCH, () => {
                    this.node.getComponent("Modal").show();
                });
                window.guideManager.after(GUIDE_STEPS.LOTTERY_DRAW_RUN, () => {
                    this.spinBtn.node.emit(cc.Node.EventType.TOUCH_END);
                });
                window.guideManager.after(GUIDE_STEPS.LOTTERY_DRAW_PRIZE, () => {
                    this.prizeModal.hide();
                });
                window.guideManager.after(GUIDE_STEPS.LOTTERY_DRAW_CLOSE, () => {
                    this.node.getComponent("Modal").hide();
                });
                this.guideHandled = true;
            }
        });
    },

    initPrizes() {
        if (window.setting && Array.isArray(window.setting.lotteryDrawPrizes)) {
            window.setting.lotteryDrawPrizes.forEach((prize, index) => {
                cc.loader.loadResDir("lottery draw prizes", (error, resources) => {
                    if (error) {
                        cc.error("error when loadResDir `lottery draw prizes`", error);
                        return;
                    }
                    var prizeNode;
                    var filterResult = resources.filter(function(resource){return resource.name == prize.icon});
                    if (filterResult.length > 0) {
                        prizeNode = cc.instantiate(filterResult[0]);
                        cc.find("amount", prizeNode).getComponent(cc.Label).string = prize.amount + "个";
                        prizeNode.rotation = (index * 360 / this.gearNum) + 360 / this.gearNum / 2;
                        this.prizesBox.addChild(prizeNode);
                    }
                });
            });
            this.prizesInited = true;
        }
    },

    setLotteryDrawState() {
        return Service.getLotteryDrawState()
        .then((res) => {
            if (res.canRun) {
                this.spinBtn.node.active = true;
                this.spinBtn.node.setScale(1, 1);
            } else {
                this.spinBtn.node.active = false;
            }
            if (res.shareTimeRemain > 0) {
                this.shareButton.node.active = true;
            } else {
                this.shareButton.node.active = false;
            }
            return res;
        });
    },

    onDestroy() {
        cc.loader.releaseResDir("lottery draw prizes");
        cc.game.off("logged", this.afterLogged);
        cc.game.off("setting inited", this.afterSettingInited);
    },

    start () {
        this.initPrizes();
    },

    caculateFinalAngle:function(targetID)
    {
        this.finalAngle = this.targetID*this.gearAngle + this.defaultAngle;
        if(this.springback)
        {
            this.finalAngle += this.gearAngle;
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.wheelState === 0)
        {
            return;
        }
        // cc.log('......update');
        // cc.log('......state=%d',this.wheelState);

        this.effectFlag += this.curSpeed;
        if(!cc.sys.isBrowser && this.effectFlag >= this.gearAngle)
        {
            if(this.audioID)
            {
                // cc.audioEngine.pauseEffect(this.audioID);
            }
            // this.audioID = cc.audioEngine.playEffect(this.effectAudio,false);
            //this.audioID = cc.audioEngine.playEffect(cc.url.raw('resources/Sound/game_turntable.mp3'));
            this.effectFlag = 0;
        }
        if(this.wheelState == 1)
        {
            // cc.log('....加速,speed:' + this.curSpeed);
            this.spinTime += dt;
            this.wheel.node.rotation = this.wheel.node.rotation + this.curSpeed;
            if(this.curSpeed <= this.maxSpeed)
            {
                this.curSpeed += this.acc;
            }
            else
            {
                if(this.spinTime<this.duration)
                {
                    this.setHighlineRotation();
                    return;
                }
                // cc.log('....开始减速');
                //设置目标角度
                this.finalAngle = (this.gearNum - this.targetID) * this.gearAngle + this.defaultAngle;
                this.maxSpeed = this.curSpeed;
                if(this.springback)
                {
                    this.finalAngle += this.gearAngle;
                }
                this.wheel.node.rotation = this.finalAngle;
                this.wheelState = 2;
            }
        }
        else if(this.wheelState == 2)
        {
            // cc.log('......减速');
            var curRo = this.wheel.node.rotation; //应该等于finalAngle
            var hadRo = curRo - this.finalAngle;
            this.curSpeed = this.maxSpeed*((this.decAngle-hadRo)/this.decAngle) + 0.2; 
            this.wheel.node.rotation = curRo + this.curSpeed;

            if((this.decAngle-hadRo)<=0)
            {  
                // cc.log('....停止');
                this.wheelState = 0;
                this.wheel.node.rotation = this.finalAngle;
                this.stopAudioSource.play();
                if(this.springback)
                {
                    //倒转一个齿轮
                    var act = cc.rotateBy(0.5, -this.gearAngle);
                    var seq = cc.sequence(cc.delayTime(0.3),act,cc.callFunc(this.showRes, this));
                    this.wheel.node.runAction(seq);
                }
                else
                {
                    this.showRes();
                }
            }
        }
        this.setHighlineRotation();
    },
    setHighlineRotation() {
        // 指针角度所在范围
        var currentTargetIndex = Math.floor((this.wheel.node.rotation) / (360/this.gearNum)) % this.gearNum;
        this.highline.node.rotation = currentTargetIndex * (360 / this.gearNum);
    },
    showRes(){
        var self = this;
        var filterResult = window.setting.lotteryDrawPrizes.filter(function(prize){
            return prize.id == self.targetID + 1;
        });
        if (filterResult.length > 0) {
            Prop.prize(filterResult[0]);
            this.prizeModal.prize = filterResult[0];
            this.prizeModal.show();
            if (window.guideManager && window.guideManager.enabled) {
                window.guideManager.next();
            }
        }
    },
    share () {
        window.platform.share({
            success: () => {
                Service.shareLotteryDraw().then(res => {
                    this.setLotteryDrawState();
                });
            }
        });
    }
});