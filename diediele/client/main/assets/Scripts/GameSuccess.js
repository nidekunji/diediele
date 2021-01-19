// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const {PROP_TYPE} = require('../Utils/Constants');
const Modal = require('../Utils/Modal');
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
        goldcoinPrefab: cc.Prefab,
        lovePrefab: cc.Prefab,
        prizes: cc.Node,
        prizeBox: cc.Node,
        successTip: cc.Sprite,
        modalPrizeThemePiggy: Modal,
        nextlevelButton: cc.Button,
        shareButton: cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    reset () {
        const {help_seeker_id} = window.platform.getHelpInfo();
        if (help_seeker_id) {
            this.nextlevelButton.node.active = false;
            this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function(){
                cc.director.loadScene("Home");
            }, this.node.parent)));
        } else {
            this.nextlevelButton.node.active = true;
        }
    },

    start () {

    },

    setPrizes(prizes) {
        this.prizes.removeAllChildren(true);
        if (Array.isArray(prizes) && prizes.length > 0) {
            var showPrizeBox = false;
            prizes.forEach(item => {
                if (item.type == PROP_TYPE.GOLD_COIN || item.type == PROP_TYPE.LOVE) {
                    showPrizeBox = true;
                    this.prizes.addChild(this.initializePrizeNode(item.type, item.amount));
                } else if (item.type == PROP_TYPE.THEME && item.theme_id == "piggy") {
                    this.modalPrizeThemePiggy.show();
                }
            });
            if (showPrizeBox) {
                this.prizeBox.active = true;
            }
            //this.successTip.node.position.y = 294;
        } else {
            this.prizeBox.active = false;
            //this.successTip.node.position.y = 160;
        }
    },

    initializePrizeNode(prizeType, prizeAmount) {
        var prizeNode;
        switch(prizeType) {
            case PROP_TYPE.GOLD_COIN: {
                prizeNode = cc.instantiate(this.goldcoinPrefab);
                prizeNode.getChildByName("amount").getComponent(cc.Label).string = "x" + prizeAmount;
                return prizeNode;
            }
            case PROP_TYPE.LOVE: {
                prizeNode = cc.instantiate(this.lovePrefab);
                prizeNode.getChildByName("amount").getComponent(cc.Label).string = "x" + prizeAmount;
                return prizeNode;
            }
            default: break;
        }
    },

    show () {
        this.reset();
        this.prizeAction = cc.repeatForever(
            cc.sequence(
                cc.moveBy(0.5, cc.v2(0, 20)),
                cc.moveBy(1, cc.v2(0, -40)),
                cc.moveBy(0.5, cc.v2(0, 20))
            )
        );
        this.prizes.runAction(this.prizeAction);
        this.node.active = true;
        this.node.getComponent(cc.AudioSource).play();
    },
    
    hide () {
        if (this.prizeAction) {
            this.prizes.stopAction(this.prizeAction);
            this.prizes.setPositionY(0);
        }
        this.node.active = false;
        this.shareButton.interactable = true;
    }

    // update (dt) {},
});
