// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        replayButton: cc.Button,
        replayButtonWidthConsume: cc.Button,
        shareButton: cc.Button,
        watchvideoButton: cc.Button,
        helpButton: cc.Button,
        nextlevelButton: cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },

    reset () {
        this.replayButtonWidthConsume.node.active = false;
        this.nextlevelButton.node.active = false;
        this.shareButton.node.active = false;
        this.replayButton.node.active = true;
        if (window.systemInfo && window.systemInfo.SDKVersion >= "2.0.4") {
            this.watchvideoButton.node.active = true;
            this.helpButton.node.active = true;
        } else {
            this.watchvideoButton.node.active = false;
            this.helpButton.node.active = false;
        }
    },

    show () {
        this.reset();
        this.node.active = true;
        this.node.getComponent(cc.AudioSource).play();
    },
    
    hide () {
        this.node.active = false;
    }

    // update (dt) {},
});
