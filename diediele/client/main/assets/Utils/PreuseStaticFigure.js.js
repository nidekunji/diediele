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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var self = this;
            var scenePosition = cc.director.getScene().convertTouchToNodeSpace(event.touch);
            if (scenePosition.y > 100) {
                if (self.preuseNode) {
                    self.preuseNode.opacity = 50;
                    self.preuseNode.x = scenePosition.x;
                    self.preuseNode.y = scenePosition.y;
                }
                if (self.handling) {
                    return;
                }
                self.handling = true;
                cc.loader.loadRes("static figures/" + this.name, function(error, resource) {
                    if (error) {
                        console.error(error);
                    } else {
                        var newNode = cc.instantiate(resource);
                        newNode.x = scenePosition.x;
                        newNode.y = scenePosition.y;
                        newNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                            var delta = event.touch.getDelta();
                            this.x += delta.x;
                            this.y += delta.y;
                        }, newNode);
                        cc.director.getScene().addChild(newNode);
                        self.preuseNode = newNode;
                    }
                });
            } else {
                this.opacity = 100;
                var delta = event.touch.getDelta();
                this.x += delta.x;
                this.y += delta.y;
            }
        }, this.node);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            var scenePosition = cc.director.getScene().convertTouchToNodeSpace(event.touch);
            if (scenePosition.y > 100) {
                this.x = 0;
                this.y = 0;
                this.opacity = 255;
                this.handling = false;
                this.preuseNode.opacity = 255;
                delete this.preuseNode;
            } else {
                this.x = 0;
                this.y = 0;
                this.opacity = 255;
            }
        });
    },

    start () {

    },

    // update (dt) {},
});
