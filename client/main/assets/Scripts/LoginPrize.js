// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const {GUIDE_STEPS} = require('../Utils/Constants');

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
        gold1Prefab: {
            default: null,
            type: cc.Prefab
        },
        gold2Prefab: {
            default: null,
            type: cc.Prefab
        },
        gold3Prefab: {
            default: null,
            type: cc.Prefab
        },
        gold4Prefab: {
            default: null,
            type: cc.Prefab
        },
        gold5Prefab: {
            default: null,
            type: cc.Prefab
        },
        love1Prefab: {
            default: null,
            type: cc.Prefab
        },
        love2Prefab: {
            default: null,
            type: cc.Prefab
        },
        borderPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    /**
     * 
     * @param {String} icon 
     */
    getPrefabByIcon(icon) {
        switch(icon) {
            case "gold1" : {
                return this.gold1Prefab;
            }
            case "gold2" : {
                return this.gold2Prefab;
            }
            case "gold3" : {
                return this.gold3Prefab;
            }
            case "gold4" : {
                return this.gold4Prefab;
            }
            case "gold5" : {
                return this.gold5Prefab;
            }
            case "love1" : {
                return this.love1Prefab;
            }
            case "love2" : {
                return this.love2Prefab;
            }
            default: return this.gold1Prefab;
        }
    },

    getNodeByPrize(prize) {
        var node = cc.instantiate(this.getPrefabByIcon(prize.icon));
        node.getChildByName("amount").getComponent(cc.Label).string = "x" + prize.amount;
        return node;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 加载奖励列表
        window.setting.loginPrizes.forEach((prizes, day) => {
            this.node.getChildByName(day.toString()).addChild(this.getNodeByPrize(prizes[0]));
        });
        // 渲染当前星期的边框
        if (window.server && (typeof window.server.day !== "undefined")) {
            this.node.getChildByName(window.server.day.toString()).addChild(cc.instantiate(this.borderPrefab));
        }
        if (window.guideManager && window.guideManager.enabled) {
            window.guideManager.after(GUIDE_STEPS.LOGIN_PRIZE_MODAL, () => {
                this.ok();
            });
        }
    },

    start () {

    },

    /**
     * 刷新界面
     */
    refresh () {

    },

    /**
     * 确认领奖
     */
    ok () {
        this.node.emit("confirm");
        this.node.active = false;
    }

    // update (dt) {},
});
