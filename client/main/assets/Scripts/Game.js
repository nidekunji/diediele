
const {GAME_STATE, GAME_EVENTS, ERRORS, GUIDE_EVENTS, PROP_TYPE,HP_TYPE} = require('../Utils/Constants');
const Service = require('../Utils/Service');
const Prop = require('../Utils/Prop');
const PhysicsCircleCollider = require('../Utils/PhysicsCircleCollider');
const PhysicsCubeCollider = require('../Utils/PhysicsCubeCollider');
const PhysicsHexahedronCollider = require('../Utils/PhysicsHexahedronCollider');
const PhysicsTriangleCollider = require('../Utils/PhysicsTriangleCollider');
const PhysicsCube2Collider = require('../Utils/PhysicsCube2Collider');
const GameSuccess = require('./GameSuccess');
const GameFail = require('./GameFail');
const UI = require('../Utils/UI');
cc.Class({
    extends: cc.Component,

    properties: {
        debug: {
            default: false,
            displayName: "调试模式",
            tooltip: "是否启用调试模式",
           // type: cc.Boolean
        },
        scale: {
            default: 1,
            displayName: "放大倍数",
            tooltip: "游戏道具放大倍数",
            type: cc.Float
        },
        preuseBox: {
            default: null,
            displayName: "",
            tooltip: "",
            type: cc.Node
        },
        clock: {
            default: null,
            displayName: "",
            tooltip: "",
            type: cc.Node
        },
        staticBox: {
            default: null,
            displayName: "",
            tooltip: "",
            type: cc.Node
        },
        dynamicBox: {
            default: null,
            displayName: "",
            tooltip: "",
            type: cc.Node
        },
        hpImgNode: cc.Node,
        nextlevelNode: cc.Node,
        homeNode: cc.Node,
        gameSuccess: GameSuccess,
        gameFail: GameFail,
        sounds: cc.Node,
        level: {
            get() {
                return this._level;
            },
            set(value) {
                this._level = value;
                this.levelLabel.string = "第" + value + "关";
            }
        },
        levelLabel: cc.Label
    },
   
    getType (c) {
        switch(c){
            case"r":return"cube";
            case"t":return"triangle";
            case"c":return"circle";
            case"h":return"hexahedron"
        }
    },
    setType (c) {
        switch(c){
            case"cube":return"r";
            case"triangle":return"t";
            case"circle":return"c";
            case"hexahedron":return"h"
        }
    },
    getNumber (a,b) {
        var number = 62 * this.LISTCHARS.indexOf(a);
        return number += this.LISTCHARS.indexOf(b);
    },
    /**
     * 
     * @param {Number} number 
     * @param {Boolean} isLt62 是否小于62
     * @returns {String} number code
     */
    setNumber (number,isLt62) {
        void 0===isLt62 && (isLt62 = !1);
        var c="";
        if(!isLt62){
            var d=Math.floor(number/62);
            c=this.LISTCHARS[d],
            number-=Math.floor(62*d)
        }
        return c+=this.LISTCHARS[number];
    },

    /**
     * 生成静态元素code
     * @param {String} type 形状
     * @param {Number} width 宽
     * @param {Number} height 高
     * @param {Number} angle 角度
     * @param {Number} x 横坐标
     * @param {Number} y 纵坐标
     * @returns {String} static code
     */
    genStaticCode (type,width,height,angle,x,y) {
        var code;
        return code=this.setType(type),
            code+=this.setNumber(width),
            code+=this.setNumber(height),
            code+=this.setNumber(angle),
            code+=this.setNumber(x),
            code+=this.setNumber(y);
    },
    /**
     * 生成动态元素code
     * @param {String} type 形状
     * @param {Number} width 宽
     * @param {Number} height 高
     * @param {Number} angle 角度
     * @param {Number} count 数量
     * @returns {String} dynamic code
     */
    genDynamicCode (type,width,height,angle,count) {
        var code;
        return code=this.setType(type),
            code+=this.setNumber(width),
            code+=this.setNumber(height),
            code+=this.setNumber(angle),
            code+=this.setNumber(count,!0)
    },

    /**
     * 
     * @param {String} figureType 
     */
    getPhysicsCollider (figureType, width, height) {
        switch(figureType){
            case"cube": {
                if (width == height) {
                    return PhysicsCubeCollider;
                } else {
                    return PhysicsCube2Collider;
                }
            }
            case"triangle": return PhysicsTriangleCollider;
            case"circle": return PhysicsCircleCollider;
            case"hexahedron": return PhysicsHexahedronCollider
        }
    },

    getPrefabKey (figureType, width, height) {
        if (figureType == "cube") {
            return this.isWood(figureType, width, height) ? "cube2" : "cube";
        } else {
            return figureType;
        }
    },

    isWood(figureType, width, height) {
        return figureType == "cube" && width != height && (width > height ? width / height >= 2 : height / width >= 2);
    },

    isBig(width, height) {
        return width >= 200 & height >= 200;
    },

    getBgSize () {
        var size = this.LVLCODE.split("/")[0].split("_");
        return {width: size[0], height: size[1]};
    },

    /**
     * 
     * @returns {Array} [{"width":45,"height":38,"angle":0,"count":10,"figureType":"hexahedron"},{"width":180,"height":180,"angle":0,"count":1,"figureType":"cube"},{"width":180,"height":180,"angle":225,"count":1,"figureType":"triangle"}]
     */
    getDynamicFigures () {
        var dynamicCode = this.LVLCODE.split("/")[1].split("_")[1];
        for(var a = dynamicCode,figures = [],c = 0; a.length > c;){
            var d=this.getType(a[c]),
                e=this.getNumber(a[++c],a[++c]),
                f=this.getNumber(a[++c],a[++c]),
                g=this.getNumber(a[++c],a[++c]),
                h=this.getNumber("0",a[++c]),
                i={};
            while(h > 0) {
                i.width=e,i.height=f,i.angle=g,i.figureType=d,figures.push(i),h--
            }
            c++;
        }
        return figures;
    },

    /**
     * 
     */
    getStaticFigures () {
        var staticCode = this.LVLCODE.split("/")[1].split("_")[0];
        for(var a = staticCode,figures = [],c = 0; a.length > c;){
            var d=this.getType(a[c]),
                e=this.getNumber(a[++c],a[++c]),
                f=this.getNumber(a[++c],a[++c]),
                g=this.getNumber(a[++c],a[++c]),
                x=this.getNumber(a[++c],a[++c]),
                y=this.getNumber(a[++c],a[++c]),
                i={};
            i.width=e,i.height=f,i.angle=g,i.x=x,i.y=y,i.figureType=d,figures.push(i),c++
        }
        return figures;
    },

    /**
     * 加载资源及关卡数据
     * @returns {Promise}
     */
    load() {
        var self = this;
        window.platform.triggerGC();
        return Service.fetchLevelCode(this.level).then(function(lvlcode) {
            // 新手指引
            if (window.guideManager && window.guideManager.enabled) {
                  // // 开始新手指引
            cc.game.emit(GUIDE_EVENTS.BEGIN);
                
            }
            self.LVLCODE = lvlcode;
            return window.themeManager.loadResDir("static figures")
            .then(function(resources) {
                resources.forEach(function(resource) {
                    self.staticFigurePrefabs[resource._name] = resource;
                });
                self.staticFigures = self.getStaticFigures();
                self.loadStaticFigures();
            })
            .then(() => {
                return window.themeManager.loadResDir("dynamic figures")
                .then(function(resources) {
                    resources.forEach(function(resource) {
                        self.dynamicFigurePrefabs[resource._name] = resource;
                    });
                });
            })
            .then(() => {
                return window.themeManager.loadResDir("preuse dynamic figures")
                    .then(function(resources) {
                        resources.forEach(function(resource) {
                            self.preuseDynamicFigurePrefabs[resource._name] = resource;
                        });
                        self.dynamicFigures = self.getDynamicFigures();
                        self.loadPreuseDynamicFigures();
                });
            });
        })
        .catch(e => {
            console.error(e, 'eeee');
        });
    },

    /**
     * 加载静态元素
     */
    loadStaticFigures() {
        var self = this;
        var bgSize = this.getBgSize();
        var staticBox = this.staticBox;
        staticBox.width = bgSize.width;
        staticBox.height = bgSize.height;
        staticBox.x = -(bgSize.width * self.scale / 2);
        if (this.staticFigures) {
            this.staticFigures.forEach(function(item) {
                var newNode = cc.instantiate(self.staticFigurePrefabs[self.getPrefabKey(item.figureType, item.width, item.height)]);
                    newNode.rotation = item.angle;
                    newNode.scaleX = item.width / newNode.width * self.scale;
                    newNode.scaleY = item.height / newNode.height * self.scale;
                    newNode.position = cc.v2(item.x * self.scale, (staticBox.height - item.y) * self.scale);
                    staticBox.addChild(newNode);
            });
        }
    },

    loadPreuseDynamicFigures() {
        var self = this;
        if (this.dynamicFigures) {
            this.dynamicFigures.forEach(function(item) {
                var newNode = cc.instantiate(self.preuseDynamicFigurePrefabs[self.getPrefabKey(item.figureType, item.width, item.height)]);
                var texture = newNode.getChildByName("texture");
                var label = newNode.getChildByName("label").getComponent(cc.Label);
                texture.rotation = item.angle;
                label.string = item.width + " x " + item.height;
                self.preuseBox.addChild(newNode);
            });
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.homeNode.active = true;
        this.state = GAME_STATE.WAIT;
        this.moveTimes = 0;
        this.staticFigurePrefabs = {};
        this.dynamicFigurePrefabs = {};
        this.preuseDynamicFigurePrefabs = {};
        this.level = typeof window.level !== "undefined" ? window.level : 1;
        this.LISTCHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.LVLCODE = "";
        // window.rebrith = false;//重生
        // cc.game.on('GAME_EVENTS.GAME_REBIRTH', ()=>{
        //     this.beginNext();
        // });
    },

    onDestroy () {
        cc.game.off(GAME_EVENTS.GAME_PASS, this.afterGamepass);
        cc.game.off(GAME_EVENTS.GAME_OVER, this.afterGameover);
        // cc.game.off(GAME_EVENTS.GAME_REBIRTH, function(){
        //     window.rebrith = false;
        // })
        window.platform.clearHelpInfo();
        this.releaseRes();
    },

    releaseRes () {
        // 释放资源
        window.themeManager.releaseResDir("static figures");
        window.themeManager.releaseResDir("dynamic figures");
        window.themeManager.releaseResDir("preuse dynamic figures");
    },

    start () {
        var self = this;
        /**
         * 设置物理系统
         */
        var physicsManager = cc.director.getPhysicsManager();
        // 启用物理系统
        physicsManager.enabled = true;
        /*
        physicsManager.enabledAccumulator = true;
        cc.PhysicsManager.FIXED_TIME_STEP = 0.02;
        */
        if (this.debug) {
            physicsManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_pairBit |
            cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit;
        }
        /**
         * 设置碰撞管理
         */
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        if (this.debug) {
            collisionManager.enabledDebugDraw = true;
            collisionManager.enabledDrawBoundingBox = true;
        }

        this.clock.on("finish", () => {
            cc.game.emit(GAME_EVENTS.GAME_PASS);
        });

        // 监听闯关失败
        self.afterGameover = cc.game.on(GAME_EVENTS.GAME_OVER, () => {
            if (self.state == GAME_STATE.ING) {
                cc.log("game over");
                self.clock.emit("stop");
                self.state = GAME_STATE.FAIL;
                self.clearStaticFigures();
                self.gameFail.show();
                window.platform.triggerGC();
            }
        });
        // 监听闯关成功
        self.afterGamepass = cc.game.on(GAME_EVENTS.GAME_PASS, () => {
            if (self.state == GAME_STATE.ING || self.state == GAME_STATE.FAIL) {
                cc.log("game pass");
                self.homeNode.active = false;
                self.state = GAME_STATE.SUCCESS;
                self.clearStaticFigures();
                let successParams = {level: self.level};
                const {help_seeker_id, level} = window.platform.getHelpInfo();
                if (help_seeker_id && level && level === self.level) {
                    successParams.help_seeker_id = help_seeker_id;
                }
                Service.gameSuccess(successParams).then((res) => {
                    self.gameFail.hide();
                    // 更新闯关进度
                    window.userInfo.level = res.newLevel;
                    window.platform.setUserCloudStorage();
                    // 升级处理
                    if (res.upgradeLevel) {

                    }
                    // 闯关奖励处理
                    if (Array.isArray(res.prizes) && res.prizes.length > 0) {
                        Prop.prize(...res.prizes);
                    }
                    self.gameSuccess.setPrizes(res.prizes);
                    self.gameSuccess.show();
                    window.platform.clearHelpInfo();
                }).catch(e => {
                    cc.error(e);
                });
                window.platform.triggerGC();
            }
        });
        // 监听动态图形盒子的触摸事件
        this.dynamicBox.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var delta = event.touch.getDelta();
            if (self.dynamicNode) {
                self.dynamicNode.x += delta.x;
                self.dynamicNode.y += delta.y;
            }
        }, this.dynamicBox);
        this.dynamicBox.on("dblclick", function (event) {
            if (self.dynamicNode) {
                var figure = self.dynamicNode.figure;
                self.dynamicNode.opacity = 255;
                self.dynamicNode.addComponent(self.getPhysicsCollider(figure.figureType, figure.width, figure.height));
                self.dynamicNode.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                self.dynamicNode.off(cc.Node.EventType.TOUCH_MOVE);
                self.dynamicNode = null;
                self.playAudio(figure.figureType, figure.width, figure.height);
                if (self.state == GAME_STATE.ING) {
                    setTimeout(() => {
                        self.preuseBox.runAction(cc.moveBy(0.5, cc.v2(-105)));
                        self.moveTimes++;
                    }, 300);
                    if (self.dynamicFigures.length == 0) {
                        // 开始倒计时
                        self.countdown();
                    } else {
                        // 继续放入下一个形状
                        self.nextFigure();
                    }
                }
            }
        }, this.dynamicBox);

        this.load().then(() => {
            this.state = GAME_STATE.ING;
            this.nextFigure();
        });
    },
    reload () {
        this.clear();
        this.releaseRes();
        return this.load();
    },
    playAudio (figureType, width, height) {
        if (this.isWood(figureType, width, height)) {
            this.sounds.getChildByName("wood").getComponent(cc.AudioSource).play();
        } else if (this.isBig(width, height)) {
            this.sounds.getChildByName("big").getComponent(cc.AudioSource).play();
        } else {
            var rand = Math.floor(Math.random() * 6);
            if (rand == 6) {
                rand = 5;
            }
            this.sounds.getChildByName(rand.toString()).getComponent(cc.AudioSource).play();
        }
    },
    nextFigure () {
        var self = this;
        var figure = this.dynamicFigures.shift();
        var dynamicNode = cc.instantiate(this.dynamicFigurePrefabs[this.getPrefabKey(figure.figureType, figure.width, figure.height)]);
        dynamicNode.opacity = 100;
        dynamicNode.rotation = figure.angle;
        dynamicNode.position = cc.v2(0, 300);
        dynamicNode.scaleX = figure.width / dynamicNode.width * self.scale;
        dynamicNode.scaleY = figure.height / dynamicNode.height * self.scale;
        dynamicNode.figure = figure;
        this.dynamicNode = dynamicNode;
        this.dynamicBox.addChild(dynamicNode);
    },

    /**
     * 倒计时
     */
    countdown () {
        this.clock.emit("run");
    },

    /**
     * 清理关卡数据
     */
    clear () {
        this.preuseBox.removeAllChildren();
        this.preuseBox.runAction(cc.moveBy(0, cc.v2(105 * this.moveTimes)));
        this.moveTimes = 0;
        this.dynamicBox.removeAllChildren();
    },

    clearStaticFigures () {
        this.staticBox.removeAllChildren();
    },
  
    /**
     * 开始下一关
     */
    beginNext() {
        this.homeNode.active = true;
        this.gameFail.hide();
            this.gameSuccess.hide();
            this.reload().then(() => {
                this.state = GAME_STATE.ING;
                this.nextFigure();
        });
    },
    hpAction(succ) {
        let hpNode = this.hpImgNode;
        let hpx = hpNode.x;
        let hpy = hpNode.y;
        let startBtn = this.nextlevelNode;
        let time1 = 0.2;
        let time2 = 0.3;
        let move = cc.sequence(
            cc.spawn(cc.scaleTo(time1, 1.2, 1.2),
            cc.moveTo(time2, startBtn.x + startBtn.width/4, startBtn.y)),
            cc.callFunc(()=>{
                this.hpImgNode.x = hpx;
                this.hpImgNode.y = hpy;
                this.hpImgNode.scale = 1;
                succ && succ();
            })
        );
        this.hpImgNode.runAction(move);
    },
    nextLevel () {
        this.level++;
        if (window.userInfo.health >= HP_TYPE.PLAY_SUB_HP) {
            this.hpAction(() =>{
                Tools.commonChangeHp(-HP_TYPE.PLAY_SUB_HP);
                this.beginNext();
            });
        } else {
            UI.showLessHp({
                title: "提示",
                content: "体力不足，分享给好友获取体力",
                showCancel: true,
                success: () => {
                    if (Tools.isFromWx()) {
                        console.log('游戏分享复活');
                      //  window.rebrith = true;
                    } else {
                        this.beginNext();
                    }
                },
                fail: () => {
                   // window.rebrith = false;
                }
            });
            this.level--;
        }
    },

    share () {
        var self = this;
        window.platform.share({
            title: "推荐一款超好玩的游戏",
            query: "",
            success: (shareres) => {
                Service.gameShareToGroupPrize().then(res => {
                    if (Array.isArray(res.prizes)) {
                        Prop.prize(...res.prizes);
                        window.platform.showToast({
                            title: "恭喜获得金币x" + res.prizes[0].amount,
                            icon: "none"
                        });
                    }
                    // 提示获得奖励
                    self.gameSuccess.shareButton.interactable = false;
                }).catch(error => {
                    cc.error(error);
                });
                /*
                if (shareres && Array.isArray(shareres.shareTickets) && shareres.shareTickets.length > 0) {
                    
                } else {
                    window.platform.showToast({
                        title: "请分享到群聊",
                        icon: "none"
                    });
                }
                */
            }
        });
    },

    shareSkip () {
        var self = this;
        window.platform.share({
            success: (shareres) => {
                cc.game.emit(GAME_EVENTS.GAME_PASS);
                /*
                if (shareres && Array.isArray(shareres.shareTickets) && shareres.shareTickets.length > 0) {
                    
                } else {
                    window.platform.showToast({
                        title: "请分享到群聊",
                        icon: "none"
                    });
                }
                */
            }
        });
    },

    watchvideoSkip () {
        var self = this;
        window.platform.createRewardedVideoAd({
            fail(err) {
                if (err.errCode == 0) {
                    window.platform.showToast({
                        title: "今日次数已用完",
                        icon: "none",
                        duration: 2000
                    });
                    self.gameFail.watchvideoButton.interactable = false;
                } else {
                    window.platform.showToast({
                        title: err.errMsg,
                        icon: "none"
                    });
                }
            },
            cancel() {
                window.platform.showToast({
                    title: "观看完整视频才能过关",
                    icon: "none"
                });
            },
            complete() {
                cc.game.emit(GAME_EVENTS.GAME_PASS);
                /*
                Service.gameSkip(self.level).then(res => {
                    if (res.newLevel > window.userInfo.level) {
                        window.userInfo.level = res.newLevel;
                        window.platform.setUserCloudStorage();
                    }
                    self.gameFail.watchvideoButton.node.active = false;
                    self.gameFail.helpButton.node.active = false;
                    self.gameFail.nextlevelButton.node.active = true;
                }).catch(error => {
                    cc.error(error);
                });
                */
            }
        });
    },

    help () {
        if (Tools.isFromWx()) {
            wx.shareAppMessage({
                title: "老司机帮帮我，我要过这关",
                query: "help_seeker_id=" + window.userInfo.uid + "&level=" + this.level,
            });
        }
    },

    /**
     * 重新挑战
     */
    restart () {
        let startParams = {level: this.level};
        const {help_seeker_id, level} = window.platform.getHelpInfo();
        if (help_seeker_id && level && level === this.level) {
            startParams.help_seeker_id = help_seeker_id;
        }
        this.gameFail.hide();
        this.gameSuccess.hide();
        this.reload().then(() => {
            this.state = GAME_STATE.ING;
            this.nextFigure();
        });
        return;
        Service.startGame(startParams)
            .then(res => {
                if (Array.isArray(res.consumes) && res.consumes.length > 0) {
                    res.consumes.forEach(item => {
                        Prop.consume(item.type, item.amount);
                        window.platform.showToast({
                            title: "本次闯关消耗金币x" + item.amount,
                            icon: "none"
                        });
                    });
                }
                this.gameFail.hide();
                this.gameSuccess.hide();
                this.reload().then(() => {
                    this.state = GAME_STATE.ING;
                    this.nextFigure();
                });
            })
            .catch(errmsg => {
                if (errmsg == ERRORS.SERVICEERR.ERR_LACK_OF_GOLDCOIN) {
                    // 提示金币不足
                    window.platform.showToast({
                        title: "金币不足",
                        icon: "none"
                    });
                }
            });
    },
    // update (dt) {},
});
