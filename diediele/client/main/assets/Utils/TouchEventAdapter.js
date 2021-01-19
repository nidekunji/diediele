
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.lastTapTime = 0;
        this.node.on(cc.Node.EventType.TOUCH_END, function(e) {
            var currentTime = Date.now();
            var lastTapTime = self.lastTapTime;
            self.lastTapTime = currentTime;
            if (currentTime - lastTapTime <= 300) {
                self.lastTapTime = 0;
                self.node.emit("dblclick", e);

            } else {
                self.node.emit("click", e);
            }
        });
    },

    start () {

    },

    // update (dt) {},
});
