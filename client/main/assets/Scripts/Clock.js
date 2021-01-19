const {GAME_EVENTS} = require('../Utils/Constants');

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.node.on("run", function() {
            this.getComponent(cc.AudioSource).play();
            this.getChildByName("clock_needle").runAction(cc.rotateBy(8, 360));
            self.timer = setTimeout(self.onFinish.bind(self), 8000);
        });
        this.node.on("stop", function() {
            this.getComponent(cc.AudioSource).pause();
            this.getChildByName("clock_needle").stopAllActions();
            this.getChildByName("clock_needle").runAction(cc.rotateTo(0, 0));
            clearTimeout(self.timer);
        });
        this.node.on("finish", function() {
            this.emit("stop");
        });
    },

    onFinish () {
        this.node.emit("finish");
    },

    start () {

    },

    // update (dt) {},
});
