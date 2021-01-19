
cc.Class({
    extends: cc.Component,

    properties: {
        
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
