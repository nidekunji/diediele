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
        title: cc.Label,
        content: cc.Label,
        btnOK: cc.Button,
        btnCancel: cc.Button,
        showCancel: {
            get() {
                return this._showCancel;
            },
            set(value) {
                if (!value) {
                    this.btnCancel.node.active = false;
                    this.btnOK.node.position.x = 0;
                }
                this._showCancel = value;
            }
        }
    },

    setData({title, content, showCancel}) {
        this.content.string = content;
        this.showCancel = showCancel;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btnOK.node.on("click", (event) => {
            this.node.emit("complete");
            this.node.emit("success", event);
        });
        this.btnCancel.node.on("click", (event) => {
            this.node.emit("complete");
            this.node.emit("cancel", event);
        });
        this.node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    },

    start () {

    }

    // update (dt) {},
});
