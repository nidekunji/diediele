/**
 * @author kunji
 * @description 当前等级
 * @time 2020.6.2
 */
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        cc.game.on('updateCurLevel', () => {
            this.updateUI();
        });
        this.updateUI();
    },
    updateUI () {
        if (window.userInfo) {
            let str = this.node.getComponent(cc.Label).string;
            if (str) {
                let lv = window.userInfo.level ? window.userInfo.level : 1;
                this.node.getComponent(cc.Label).string = '第' + lv + '关';
            }
        }
    },
    onDestroy() {
        cc.game.off('updateCurLevel');
    },

    start () {

    },

    // update (dt) {},
});
