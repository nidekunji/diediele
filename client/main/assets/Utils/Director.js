
const Prop = require('../Utils/Prop');
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
