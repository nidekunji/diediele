/**
 * @author kunji
 * @description 跳转
 * @time 2020.5.25
 */
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // onLoad () {},

    start () {

    },

    toHome () {
        cc.director.loadScene("Home");
    },
    toRank () {
        cc.director.loadScene("Rank");
    },
    toStore () {
        cc.director.loadScene("Store");
    }

    // update (dt) {},
});
