/**
 * @author kunji
 * @description 点击音效,公用点击函数
 * @time 2020.5.27
 */

const {HP_TYPE} = require('../Utils/Constants');
const UI = require('../Utils/UI');
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END, function(e) {
            cc.game.emit("button press");
        });
        if (this.node._name == 'btnrank'){//创建透明授权按钮
            if (Tools.isFromWx()) {
                WxTools.createAuthorizeBtn(this.node, ()=> {
                    let rank = cc.find('Canvas/rank modal').getComponent('Modal');
                    rank.show();
                });
            }
        }        
    },
    /**
     * 分享加体力
     */
    onShare() {
        if (Tools.isFromWx()) {
            WxTools.share(function (){
                UI.getHp(HP_TYPE.SHARE_ADD_HP, function () {
                    Tools.commonChangeHp(HP_TYPE.SHARE_ADD_HP);
                });
            });
        } else {
            UI.getHp(HP_TYPE.SHARE_ADD_HP, function () {
                Tools.commonChangeHp(HP_TYPE.SHARE_ADD_HP);
            });
        }
    },
    /**
     * 客服会话
     */
    customerService() {
        if (window.getFreeHp) {
            window.getFreeHp = false;
        }
        if (Tools.isFromWx() && !window.getFreeHp) {

        }
    },

    start () {

    },

    // update (dt) {},
});
