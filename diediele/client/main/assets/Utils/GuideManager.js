const {GAME_EVENTS, GUIDE_EVENTS, GUIDE_STEPS} = require('./Constants');

cc.Class({
    extends: cc.Object,

    properties: {
        enabled: {
            get () {
                return this._enabled;
            },
            set (value) {
                this._enabled = value;
                if (value) {
                    this.onEnable();
                } else {
                    this.onDisable();
                }
            }
        },
        step: {
            get () {
                return this._step;
            },
            set (value) {
                this._step = value;
            }
        }
    },

    ctor() {
        this.box = cc.find("Launch");
        this.currentStepIndex = 0;
        this.currentStepTip = null;
        this.steps = [
            GUIDE_STEPS.WELCOME,
            GUIDE_STEPS.LOGIN_PRIZE_TIP,
            GUIDE_STEPS.LOGIN_PRIZE_MODAL,
            GUIDE_STEPS.LOTTERY_DRAW_AND_TIMEBAG_TIP,
            GUIDE_STEPS.LOTTERY_DRAW_TOUCH,
            GUIDE_STEPS.LOTTERY_DRAW_RUN,
            GUIDE_STEPS.LOTTERY_DRAW_PRIZE,
            GUIDE_STEPS.LOTTERY_DRAW_CLOSE,
            GUIDE_STEPS.TIMEDBAG_TOUCH,
            GUIDE_STEPS.TIMEDBAG_PRIZE,
            GUIDE_STEPS.START_GAME_TOUCH,
            GUIDE_STEPS.CHOOSE_LEVEL_TOUCH,
            GUIDE_STEPS.GAME_BASE_DESCRIPTION,
            GUIDE_STEPS.GAME_PLAY_STEP_1,
            GUIDE_STEPS.GAME_PLAY_STEP_2,
            GUIDE_STEPS.GAME_PLAY_STEP_3,
            GUIDE_STEPS.GAME_PLAY_STEP_4,
            GUIDE_STEPS.GAME_PLAY_STEP_5,
            GUIDE_STEPS.GAME_PLAY_STEP_6,
            GUIDE_STEPS.GAME_PLAY_STEP_7,
            GUIDE_STEPS.GAME_PLAY_STEP_8,
            GUIDE_STEPS.GAME_PLAY_STEP_9,
            GUIDE_STEPS.GAME_PLAY_STEP_10
        ];
    },

    onEnable () {
        var self = this;
        this.resources = {}
        // 预加载资源
        cc.loader.loadResDir("guide", (error, resources) => {
            if (error) {
                cc.error("error when loadResDir `guide`", error);
                return;
            }
            resources.forEach(resource => {
                this.resources[resource.name] = resource;
            });
            cc.game.emit(GUIDE_EVENTS.BEGIN);
        });
        // 开始新手指引
        cc.game.on(GUIDE_EVENTS.BEGIN, () => {
            // 欢迎界面
            cc.game.emit(GUIDE_EVENTS.STEP_BEGIN, {step: GUIDE_STEPS.WELCOME});
        });
        // 开始某一步
        cc.game.on(GUIDE_EVENTS.STEP_BEGIN, (event) => {
            var step = self.step = event.step;
            switch(step) {
                // 欢迎界面
                case GUIDE_STEPS.WELCOME : {
                    var tip = cc.instantiate(self.resources["welcome tip"]);
                    tip.setScale(0);
                    self.box.addChild(tip);
                    tip.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        tip.runAction(cc.sequence(cc.fadeTo(0.5, 0), cc.callFunc(function(){
                            self.next();
                        })))
                    });
                    self.currentStepTip = tip;
                    break;
                }
                // 登录奖励提示
                case GUIDE_STEPS.LOGIN_PRIZE_TIP : {
                    var tip = cc.instantiate(self.resources["login prize tip"]);
                    tip.setScale(0);
                    self.box.addChild(tip);
                    tip.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        tip.runAction(cc.sequence(cc.fadeTo(0.5, 0), cc.callFunc(function(){
                            cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                        })));
                    });
                    self.currentStepTip = tip;
                    break;
                }
                // 领取登录奖励
                case GUIDE_STEPS.LOGIN_PRIZE_MODAL : {
                    var tip = cc.instantiate(self.resources["touch tip"]);
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                        self.next();
                    });
                    self.currentStepTip = tip;
                    self.box.addChild(tip);
                    break;
                }

                // 抽抽乐和限时礼包提示
                case GUIDE_STEPS.LOTTERY_DRAW_AND_TIMEBAG_TIP : {
                    var tip = cc.instantiate(self.resources["lottery draw and timedbag tip"]);
                    tip.setScale(0);
                    self.box.addChild(tip);
                    tip.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        tip.runAction(cc.sequence(cc.fadeTo(0.5, 0), cc.callFunc(function(){
                            self.next();
                        })));
                    });
                    self.currentStepTip = tip;
                    break;
                }

                // 抽抽乐 - 点击入口按钮
                case GUIDE_STEPS.LOTTERY_DRAW_TOUCH : {
                    var tip = cc.instantiate(self.resources["touch tip"]);
                    tip.setPosition(-95, 74);
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                        self.next();
                    });
                    self.box.addChild(tip);
                    self.currentStepTip = tip;
                    break;
                }
                // 抽抽乐 - 点击开始按钮
                case GUIDE_STEPS.LOTTERY_DRAW_RUN : {
                    var tip = cc.instantiate(self.resources["touch tip"]);
                    tip.setPosition(0, 65);
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                    });
                    self.box.addChild(tip);
                    self.currentStepTip = tip;
                    break;
                }

                // 抽抽乐 - 奖励提示
                case GUIDE_STEPS.LOTTERY_DRAW_PRIZE : {
                    var tip = cc.instantiate(self.resources["touch to next tip"]);
                    tip.setScale(0);
                    self.box.addChild(tip);
                    tip.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                        self.next();
                    });
                    self.currentStepTip = tip;
                    break;
                }

                // 抽抽乐 - 关闭提示
                case GUIDE_STEPS.LOTTERY_DRAW_CLOSE : {
                    var tip = cc.instantiate(self.resources["touch tip"]);
                    tip.setPosition(-294, -597);
                    tip.setScale(0.65);
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                        self.next();
                    });
                    self.box.addChild(tip);
                    self.currentStepTip = tip;
                    break;
                }

                // 限时礼包 - 点击按钮
                case GUIDE_STEPS.TIMEDBAG_TOUCH : {
                    var tip = cc.instantiate(self.resources["touch tip"]);
                    tip.setPosition(87, 63);
                    tip.setScale(0.9);
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                    });
                    self.box.addChild(tip);
                    self.currentStepTip = tip;
                    break;
                }

                // 限时礼包 - 奖励提示
                case GUIDE_STEPS.TIMEDBAG_PRIZE : {
                    var tip = cc.instantiate(self.resources["timedbag prize tip"]);
                    tip.setScale(0);
                    self.box.addChild(tip);
                    tip.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        tip.runAction(cc.sequence(cc.fadeTo(0.5, 0), cc.callFunc(function(){
                            cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                            self.next();
                        })));
                    });
                    self.currentStepTip = tip;
                    break;
                }

                // 点击开始游戏按钮
                case GUIDE_STEPS.START_GAME_TOUCH : {
                    var tip = cc.instantiate(self.resources["touch tip"]);
                    tip.setPosition(0, -177);
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                        self.next();
                    });
                    self.box.addChild(tip);
                    self.currentStepTip = tip;
                    break;
                }

                // 点击按钮选择关卡
                case GUIDE_STEPS.CHOOSE_LEVEL_TOUCH : {
                    self.afterLevelPagesLoaded = cc.game.on(GAME_EVENTS.LEVEL_PAGES_LOADED, () => {
                        var tip = cc.instantiate(self.resources["touch tip"]);
                        tip.setPosition(-270, 355);
                        tip.setScale(0.6);
                        tip.on(cc.Node.EventType.TOUCH_END, () => {
                            cc.game.emit(GUIDE_EVENTS.STEP_END, {step: GUIDE_STEPS.CHOOSE_LEVEL_TOUCH});
                            window.level = 1;
                            cc.director.loadScene("Main");
                        });
                        self.box.addChild(tip);
                        self.currentStepTip = tip;
                    });
                    break;
                }

                // 游戏界面基本介绍
                case GUIDE_STEPS.GAME_BASE_DESCRIPTION : {
                    var tip = cc.instantiate(self.resources["game base description"]);
                    tip.children.forEach(child => {
                        child.setScale(0);
                    });
                    self.box.addChild(tip);
                    tip.runAction(cc.sequence(
                        cc.callFunc(function(){
                            cc.find("static", tip).runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                        }),
                        cc.callFunc(function(){
                            cc.find("dynamic", tip).runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                        }),
                        cc.callFunc(function(){
                            cc.find("clock", tip).runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                        }),
                        cc.callFunc(function(){
                            cc.find("description", tip).runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                        })
                    ));
                    tip.on(cc.Node.EventType.TOUCH_END, () => {
                        tip.runAction(cc.sequence(cc.fadeTo(0.5, 0), cc.callFunc(function(){
                            cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                            self.next();
                        })));
                    });
                    self.currentStepTip = tip;
                    break;
                }

                // 游戏第1步
                case GUIDE_STEPS.GAME_PLAY_STEP_1 : {
                    var startRect = cc.rect(143, 445, 10, 10);
                    var endRect = cc.rect(83, 123, 16, 16);
                    self.addGameTrajectoryGuidance(step, 1, startRect, endRect, [
                        cc.v2(83, 250)
                    ]);
                    break;
                }

                // 游戏第2步
                case GUIDE_STEPS.GAME_PLAY_STEP_2 : {
                    self.addGameDblclickGuidance(step, 2);
                    break;
                }
                
                // 游戏第3步
                case GUIDE_STEPS.GAME_PLAY_STEP_3 : {
                    var startRect = cc.rect(157, 417.2, 10, 10);
                    var endRect = cc.rect(92, 60, 20, 20);
                    self.addGameTrajectoryGuidance(step, 3, startRect, endRect, [
                        cc.v2(87, 212)
                    ]);
                    break;
                }

                // 游戏第4步
                case GUIDE_STEPS.GAME_PLAY_STEP_4 : {
                    self.addGameDblclickGuidance(step, 4);
                    break;
                }

                // 游戏第5步
                case GUIDE_STEPS.GAME_PLAY_STEP_5 : {
                    var startRect = cc.rect(77.6, 418.1, 10, 10);
                    var endRect = cc.rect(148, 61, 20, 20);
                    self.addGameTrajectoryGuidance(step, 5, startRect, endRect, [
                        cc.v2(144, 237)
                    ]);
                    break;
                }

                // 游戏第6步
                case GUIDE_STEPS.GAME_PLAY_STEP_6 : {
                    self.addGameDblclickGuidance(step, 6);
                    break;
                }

                // 游戏第7步
                case GUIDE_STEPS.GAME_PLAY_STEP_7 : {
                    self.addGameDblclickGuidance(step, 7);
                    break;
                }

                // 游戏第8步
                case GUIDE_STEPS.GAME_PLAY_STEP_8 : {
                    var startRect = cc.rect(112.8, 633.1, 10, 10);
                    var endRect = cc.rect(111, 66, 20, 20);
                    self.addGameTrajectoryGuidance(step, 8, startRect, endRect, [
                        cc.v2(31, 315)
                    ]);
                    break;
                }

                // 游戏第9步
                case GUIDE_STEPS.GAME_PLAY_STEP_9 : {
                    self.addGameDblclickGuidance(step, 9);
                    break;
                }

                // 游戏第10步
                case GUIDE_STEPS.GAME_PLAY_STEP_10 : {
                    var tip = cc.instantiate(self.resources["game step10"]);
                    tip.setScale(0);
                    self.box.addChild(tip);
                    tip.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.3, 1)));
                    self.afterGamepass = cc.game.on(GAME_EVENTS.GAME_PASS, () => {
                        tip.runAction(cc.sequence(cc.fadeTo(0.5, 0), cc.callFunc(function(){
                            cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                            self.next();
                        })));
                    });
                    self.currentStepTip = tip;
                    break;
                }
                default:break;
            }
        });
        // 结束某一步
        cc.game.on(GUIDE_EVENTS.STEP_END, () => {
            self.currentStepTip.active = false;
            if (self.currentStepIndex == self.steps.length - 1) {
                cc.game.emit(GUIDE_EVENTS.END);
            }
        });
        // 若某一步出错
        cc.game.on(GUIDE_EVENTS.STEP_ERROR, () => {
            // 直接结束指引
            console.log('======某一步出错===');
            cc.game.emit(GUIDE_EVENTS.END);
        });
        // 监听游戏失败
        self.afterGameover = cc.game.on(GAME_EVENTS.GAME_OVER, function() {
            cc.game.emit(GUIDE_EVENTS.END);
        });
        // 新手指引结束
        cc.game.on(GUIDE_EVENTS.END, () => {
            if(self.currentStepTip) {
                self.currentStepTip.removeFromParent();
            }
            cc.game.off(GUIDE_EVENTS.BEGIN);
            cc.game.off(GUIDE_EVENTS.STEP_BEGIN);
            cc.game.off(GUIDE_EVENTS.STEP_ERROR);
            cc.game.off(GUIDE_EVENTS.STEP_END);
            cc.game.off(GUIDE_EVENTS.END);
            cc.game.off(GAME_EVENTS.LEVEL_PAGES_LOADED, self.afterLevelPagesLoaded);
            cc.game.off(GAME_EVENTS.GAME_PASS, self.afterGamepass);
            cc.game.off(GAME_EVENTS.GAME_OVER, self.afterGameover);
            self.enabled = false;
            if (typeof self.onFinish === "function") {
                self.onFinish();
            }
        });
    },

    onDisable () {
        this.resources = null;
        cc.loader.releaseResDir("guide");
    },

    addGameDblclickGuidance (step, stepNumber) {
        var self = this;
        var game = cc.find("Canvas").getComponent("Game");
        var tip = cc.instantiate(self.resources["game step" + stepNumber]);
        tip.opacity = 0;
        self.box.addChild(tip);
        tip.runAction(cc.fadeTo(0.5, 255));
        tip.on("dblclick", (event) => {
            if (tip.locked) {
                return;
            }
            tip.locked = true;
            game.dynamicBox.emit("dblclick");
            tip.runAction(cc.sequence(cc.fadeTo(0.5, 0), cc.callFunc(function(){
                cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                self.next();
            })));
        });
        self.currentStepTip = tip;
    },

    addGameTrajectoryGuidance (step, stepNumber, startRect, endRect, bezier) {
        var self = this;
        var game = cc.find("Canvas").getComponent("Game");
        var tip = cc.instantiate(self.resources["game step" + stepNumber]);
        tip.opacity = 0;
        self.box.addChild(tip);
        tip.runAction(cc.fadeTo(0.5, 255));
        // 添加起点
        bezier.unshift(startRect.center);
        // 添加终点
        bezier.push(endRect.center);
        cc.find("hand", tip).runAction(cc.repeatForever(cc.sequence(cc.bezierTo(1.4, bezier), cc.moveTo(0, startRect.center))));
        tip.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (tip.locked) {
                return;
            }
            cc.find("hand", tip).active = false;
            cc.find("guiji", tip).active = false;
        });
        tip.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if (tip.locked) {
                return;
            }
            var delta = event.touch.getDelta();
            game.dynamicNode.x += delta.x;
            game.dynamicNode.y += delta.y;
        });
        tip.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (tip.locked) {
                return;
            }
            tip.locked = true;
            var startMoveLocation = tip.convertToNodeSpace(event.touch.getStartLocation());
            var endMoveLocation = tip.convertTouchToNodeSpace(event.touch);
            var moveVec2 = cc.pSub(endMoveLocation, startMoveLocation);
            var dynamicNodeEndMoveLocation = cc.pAdd(startRect.center, moveVec2);
            if (endRect.contains(dynamicNodeEndMoveLocation)) {
                tip.runAction(
                    cc.sequence(
                        cc.fadeTo(0.5, 0),
                        cc.callFunc(function(){
                            cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                            self.next();
                        })
                    )
                );
            } else {
                game.dynamicNode.runAction(
                    cc.sequence(
                        cc.moveTo(0.5, cc.v2(0, 300)),
                        cc.callFunc(function() {
                            cc.find("hand", tip).active = true;
                            cc.find("guiji", tip).active = true;
                            tip.locked = false;
                        })
                    )
                );
            }
        });
        tip.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            if (tip.locked) {
                return;
            }
            var startMoveLocation = tip.convertToNodeSpace(event.touch.getStartLocation());
            var endMoveLocation = tip.convertTouchToNodeSpace(event.touch);
            var moveVec2 = cc.pSub(endMoveLocation, startMoveLocation);
            var dynamicNodeEndMoveLocation = cc.pAdd(startRect.center, moveVec2);
            if (endRect.contains(dynamicNodeEndMoveLocation)) {
                tip.off(cc.Node.EventType.TOUCH_START);
                tip.off(cc.Node.EventType.TOUCH_MOVE);
                tip.off(cc.Node.EventType.TOUCH_END);
                tip.off(cc.Node.EventType.TOUCH_CANCEL);
                tip.runAction(cc.sequence(cc.fadeTo(0.5, 0), cc.callFunc(function(){
                    cc.game.emit(GUIDE_EVENTS.STEP_END, {step: step});
                    self.next();
                })));
            } else {
                game.dynamicNode.runAction(
                    cc.sequence(
                        cc.callFunc(function(){
                            tip.locked = true;
                        }),
                        cc.moveTo(0.5, cc.v2(0, 300)),
                        cc.callFunc(function() {
                            cc.find("hand", tip).active = true;
                            cc.find("guiji", tip).active = true;
                            tip.locked = false;
                        })
                    )
                );
            }
        });
        self.currentStepTip = tip;
    },

    after (step, callback) {
        cc.game.on(GUIDE_EVENTS.STEP_END, event => {
            if (event.step == step) {
                console.log('================新手教程结束===============');
                typeof callback == "function" && callback();
            }
        });
    },

    next () {
        this.currentStepTip.removeFromParent();
        this.currentStepIndex++;
        cc.game.emit(GUIDE_EVENTS.STEP_BEGIN, {
            step: this.steps[this.currentStepIndex]
        });
    }
});
