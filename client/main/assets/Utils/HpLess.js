/**
 * @author kunji
 * @description 体力不足
 * @time 2020.6.4
 */
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Label,
        btnOK: cc.Button,
        btnCancel: cc.Button,
    },
    setData({content, showCancel}) {
        this.content.string = this.calculateRecoverTime();
    },
    calculateRecoverTime() {
        let str = '';
        if (window.userInfo) {
            if (window.userInfo.health >= 5) {
                return str;
            }
            let all = (5 - window.userInfo.health) * 5;
            if (window.hpRecoverTime) {
                str = '全部恢复：' + all + '分钟' + window.hpRecoverTime + '秒';
            } else {
                str = '全部恢复：' + all + '分钟'; 
            }
            return str;
        }
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

    start () {

    },

    // update (dt) {},
});
