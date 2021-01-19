var progressBarWidth = 533;
function createImage(sprite,url){
    let image = wx.createImage();
    image.onload = function () {
        let texture = new cc.Texture2D();
        texture.initWithElement(image);
        texture.handleLoadedTexture();
        sprite.spriteFrame = new cc.SpriteFrame(texture);
    };
    image.src = url;
}

// 设置适配模式
cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_WIDTH);

// 设置设计分辨率尺寸和适配模式
cc.view.setDesignResolutionSize(750, 1334, cc.ResolutionPolicy.FIXED_WIDTH);

// 设置资源分辨率到设计分辨率的缩放比例
cc.director.setContentScaleFactor(1);

var {screenWidth, screenHeight} = wx.getSystemInfoSync();

// 添加场景和Canvas节点
var scene = new cc.Scene();
var root = new cc.Node();
root.scale = screenWidth / cc.winSize.width / cc.view.getScaleX();
var canvas = root.addComponent(cc.Canvas);
root.parent = scene;

// 添加启动页背景
var bgNode = new cc.Node();
var bgSprite = bgNode.addComponent(cc.Sprite);
createImage(bgSprite, "resources/launch_bg.png");
var widget = bgNode.addComponent(cc.Widget);
widget.isAlignTop = true;
widget.isAlignBottom = true;
widget.isAlignLeft = true;
widget.isAlignRight = true;
widget.left = 0;
widget.top = 0;
widget.right = 0;
widget.bottom = 0;
bgNode.parent = root;

// 添加进度条背景
var progressbarBgNode = new cc.Node();
progressbarBgNode.setPositionY(-242);
var progressbarBgSprite = progressbarBgNode.addComponent(cc.Sprite);
createImage(progressbarBgSprite, "resources/launch_progressbar_bg.png");
progressbarBgNode.parent = root;

// 添加进度条节点
var progressbarNode = new cc.Node();
progressbarNode.anchorX = 0;
progressbarNode.width = 0;
progressbarNode.height = 60;
progressbarNode.setPosition(-progressBarWidth / 2, -242);
var mask = progressbarNode.addComponent(cc.Mask);

// 添加进度条
var progressNode = new cc.Node();
progressNode.setPositionX(progressBarWidth / 2);
var progressSprite = progressNode.addComponent(cc.Sprite);
createImage(progressSprite, "resources/launch_progressbar_progress.png");
progressbarNode.addChild(progressNode);
progressbarNode.parent = root;

// 添加指示器
var indicaterNode = new cc.Node();
indicaterNode.setPosition(-progressBarWidth / 2, -242);
var indicaterSprite = indicaterNode.addComponent(cc.Sprite);
createImage(indicaterSprite, "resources/launch_progressbar_indicater.png");
// 添加百分号
var percentSymbolNode = new cc.Node();
percentSymbolNode.setPosition(14.4, 0);
percentSymbolNode.color = "#832309";
var percentSymbolLabel = percentSymbolNode.addComponent(cc.Label);
percentSymbolLabel.string = "%";
percentSymbolLabel.fontSize = 14;
percentSymbolLabel.lineHeight = 14;
var percentSymbolLabelOutline = percentSymbolNode.addComponent(cc.LabelOutline);
percentSymbolLabelOutline.width = 1;
percentSymbolLabelOutline.color = "#FFD38E";
indicaterNode.addChild(percentSymbolNode);
// 添加百分数值
var percentNode = new cc.Node();
percentNode.setPosition(-5.6, 0);
percentNode.color = "#832309";
var percentLabel = percentNode.addComponent(cc.Label);
percentLabel.string = "0";
percentLabel.fontSize = 20;
percentLabel.lineHeight = 20;
var percentLabelOutline = percentNode.addComponent(cc.LabelOutline);
percentLabelOutline.width = 1;
percentLabelOutline.color = "#FFD38E";
indicaterNode.addChild(percentNode);
indicaterNode.parent = root;


cc.loader.onProgress = function (completedCount, totalCount, item) {
    var percent = completedCount / totalCount;
    percentLabel.string = Math.ceil(percent * 100) - 1;
    progressbarNode.width = percent * progressBarWidth;
    if (percent > 0.5) {
        indicaterNode.setPositionX((percent - 0.5) * progressBarWidth);
    } else {
        indicaterNode.setPositionX((-1) * (0.5 - percent) * progressBarWidth);
    }
}

module.exports = scene;