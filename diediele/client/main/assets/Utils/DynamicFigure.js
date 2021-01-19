/**
 * @author kunji
 * @description 监听item
 * @time 2020.5.25
 */
const {GAME_EVENTS} = require('./Constants');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        if (this.node.position.y < - cc.winSize.height / 2) {
            cc.game.emit(GAME_EVENTS.GAME_OVER);
            this.node.destroy();
        }
    },
});
