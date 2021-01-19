const noop = function(){}
const Dialog = require('./Dialog')
const HpLess = require('./HpLess')
const Gethp = require('./Gethp')
function showModal({title, content, showCancel, success,fail}) {
    cc.loader.loadRes("ui/dialog", (error, resource) => {
        if (error) {
            cc.error(error);
        } else {
            var dialog = cc.instantiate(resource);
            var dialogComponent = dialog.getComponent(Dialog);
            dialogComponent.setData({title, content, showCancel});
            dialog.on("success", function(event) {
                if (typeof success === "function") {
                    success();
                }
                this.destroy();
            });
            dialog.on("cancel", function() {
                if (typeof fail === "function") {
                    fail();
                }
                this.destroy();
            });
            dialog.on("complete", function() {
                cc.loader.releaseRes("ui/dialog");
            });
            cc.director.getScene().addChild(dialog);
        }
    });
}
function showLessHp({content, showCancel, success,fail}) {
    cc.loader.loadRes("ui/hpless", (error, resource) => {
        if (error) {
            cc.error(error);
        } else {
            var dialog = cc.instantiate(resource);
            var dialogComponent = dialog.getComponent(HpLess);
            dialogComponent.setData({content, showCancel});
            dialog.on("success", function(event) {
                if (typeof success === "function") {
                    success();
                }
                this.destroy();
            });
            dialog.on("cancel", function() {
                if (typeof fail === "function") {
                    fail();
                }
                this.destroy();
            });
            dialog.on("complete", function() {
                cc.loader.releaseRes("ui/hpless");
            });
            cc.director.getScene().addChild(dialog);
        }
    });
}
function getHp(addNum,success,fail) {
    cc.loader.loadRes("ui/gethp", (error, resource) => {
        if (error) {
            cc.error(error);
        } else {
            var dialog = cc.instantiate(resource);
            var dialogComponent = dialog.getComponent(Gethp);
            dialogComponent.setData(addNum);
            dialog.on("success", function(event) {
                if (typeof success === "function") {
                    success();
                }
                this.destroy();
            });
            dialog.on("cancel", function() {
                if (typeof fail === "function") {
                    fail();
                }
                this.destroy();
            });
            dialog.on("complete", function() {
                cc.loader.releaseRes("ui/gethp");
            });
            cc.director.getScene().addChild(dialog);
        }
    });
}
module.exports = {
    showModal,
    showLessHp,
    getHp,
}