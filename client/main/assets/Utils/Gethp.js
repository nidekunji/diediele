/**
 * @author kunji
 * @description 获取体力界面
 * @time 2020.6.4
 */
const {GAME_EVENTS} = require('../Utils/Constants');
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Label,
        btnOK: cc.Button,
        btnCancel: cc.Button,
        light: cc.Node,
    },
    setData(content) {
        this.content.string = 'x' + content;
        this.runLight();
    },
    runLight() {
        this.light.stopAllActions();
        let action = cc.repeatForever(
            cc.sequence(
                cc.rotateTo(1, 90),
                cc.rotateTo(1, 180),
                cc.rotateTo(1, 270),
                cc.rotateTo(1, 360),
            )
        )
        this.light.runAction(action);
    },
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
    onDestroy() {
        // if (window.rebrith) {
        //     console.log('=====复活====');
        //     cc.game.emit(GAME_EVENTS.GAME_REBIRTH)
        // }
    },

    // update (dt) {},
});
