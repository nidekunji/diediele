/**
 * @author kunji
 * @description 
 * @time 2020.5.25
 */
const {GAME_EVENTS} = require('../Utils/Constants');

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.node.on("run", function() {
            self.node.getComponent(cc.AudioSource).play();
            self.node.getChildByName("clock_needle").runAction(cc.rotateBy(8, 360));
            self.timer = setTimeout(self.onFinish.bind(self), 8000);
        });
        this.node.on("stop", function() {
            self.node.getComponent(cc.AudioSource).pause();
            self.node.getChildByName("clock_needle").stopAllActions();
            self.node.getChildByName("clock_needle").runAction(cc.rotateTo(0, 0));
            clearTimeout(self.timer);
        });
        this.node.on("finish", function() {
            self.node.emit("stop");
        });
    },

    onFinish () {
        this.node.emit("finish");
    },

    start () {

    },

    // update (dt) {},
});
