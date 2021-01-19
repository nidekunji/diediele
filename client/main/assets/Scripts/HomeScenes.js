/**
 * @author kunji
 * @description 主页场景，初始化全局变量
 * @time 2020.6.2
 */
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        if (!window.HTTP) {
            window.HTTP = require('../Utils/HTTP');
            window.Tools = require('../Utils/tools');
            window.WxTools = require('../Utils/WxTools');
        }
    },

    start () {

    },

    // update (dt) {},
});
