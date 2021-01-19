// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        tabBox: cc.Node,
        pageBox: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        var tabs = this.tabs = this.tabBox.getChildren();
        var pages = this.pages = this.pageBox.getChildren();
        if (Array.isArray(tabs) && tabs.length > 0) {
            tabs.forEach(function(tab, index){
                tab.on(cc.Node.EventType.TOUCH_END, function (event) {
                    console.log("tab selected");
                    self.onTabSelected(index);
                }, tab);
            });
        }
        this.onTabSelected(0);
    },

    onTabSelected(index) {
        if (Array.isArray(this.tabs) && this.tabs.length > 0) {
            this.tabs.forEach(function(tab, index){
                tab.getComponent("TabItem").setInactive();
            });
            this.tabs[index].getComponent("TabItem").setActive();
        }
        if (Array.isArray(this.pages) && this.pages.length > 0) {
            this.pages.forEach(function(page, index){
                page.active = false;
            });
            this.pages[index].active = true;
        }
    },

    start () {

    },

    // update (dt) {},
});
