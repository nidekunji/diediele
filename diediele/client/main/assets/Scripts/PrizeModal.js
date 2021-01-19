// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var {PROP_TYPE} = require('../Utils/Constants');

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
        prizeBox: cc.Node,
        prize: {
            get() {
                return this._prize;
            },
            set(value) {
                this._prize = value;
                this.refreshPrizeBox();
            }
        },
        goldcoinPrizePrefab: cc.Prefab,
        lovePrizePrefab: cc.Prefab
    },

    refreshPrizeBox () {
        this.prizeBox.removeAllChildren();
        switch(this.prize.type) {
            case PROP_TYPE.GOLD_COIN : {
                var prizeNode = cc.instantiate(this.goldcoinPrizePrefab);
                prizeNode.getChildByName("amount").getComponent(cc.Label).string = "x" + this.prize.amount;
                this.prizeBox.addChild(prizeNode);
                break;
            }
            case PROP_TYPE.LOVE : {
                var prizeNode = cc.instantiate(this.lovePrizePrefab);
                prizeNode.getChildByName("amount").getComponent(cc.Label).string = "x" + this.prize.amount;
                this.prizeBox.addChild(prizeNode);
                break;
            }
            default: break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    hide () {
        this.getComponent("Modal").hide();
    },

    show () {
        this.getComponent("Modal").show();
    }

    // update (dt) {},
});
