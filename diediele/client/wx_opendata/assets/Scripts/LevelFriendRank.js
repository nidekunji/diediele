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
        levelRankItemFirst: cc.Prefab,
        levelRankItemSecond: cc.Prefab,
        levelRankItemThird: cc.Prefab,
        levelRankItemOdd: cc.Prefab,
        levelRankItemEven: cc.Prefab,
        scrollView: cc.ScrollView
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        this.getFriendRank();
    },

    loadLevelRank (dataList) {
        dataList.sort(function(a, b){
            return parseInt(b.KVDataList[0].value) - parseInt(a.KVDataList[0].value);
        });
        dataList.forEach((item, index) => {
            this.loadLevelRankItem(item, ++index);
        });
    },
    initializeNode(originNode, data) {
        var levelRankItem = originNode.getComponent("LevelRankItem");
        levelRankItem.nickname.string = data.nickname;
        levelRankItem.level.string = data.KVDataList[0].value + "关";
        if (levelRankItem.rank) {
            levelRankItem.rank.string = data.rank;
        }
        if (data.avatarUrl) {
            this.createImage(levelRankItem.avatar, data.avatarUrl);
        }
        return originNode;
    },
    createImage(sprite,url){
        let image = wx.createImage();
        image.onload = function () {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
    },
    loadLevelRankItem (data, rank) {
        var tmpNode;
        data.rank = rank;
        if (rank == 1) {
            tmpNode = cc.instantiate(this.levelRankItemFirst);
            this.scrollView.content.addChild(this.initializeNode(tmpNode, data));
        } else if (rank == 2) {
            tmpNode = cc.instantiate(this.levelRankItemSecond);
            this.scrollView.content.addChild(this.initializeNode(tmpNode, data));
        } else if (rank == 3) {
            tmpNode = cc.instantiate(this.levelRankItemThird);
            this.scrollView.content.addChild(this.initializeNode(tmpNode, data));
        } else {
            if (rank % 2 == 0) {
                tmpNode = cc.instantiate(this.levelRankItemEven);
                this.scrollView.content.addChild(this.initializeNode(tmpNode, data));
            } else {
                tmpNode = cc.instantiate(this.levelRankItemOdd);
                this.scrollView.content.addChild(this.initializeNode(tmpNode, data));
            }
        }
    },

    getFriendRank() {
        var self = this;
        wx.getFriendCloudStorage({
            keyList: ['avatarUrl', 'nickname', 'openid', 'level'],
            success(res) {
                cc.log("friend cloud storage", res);
                self.loadLevelRank(res.data);
            },
            fail(e) {
                cc.error("get friend cloud storage error: " + e.errorMessage);
            }
        })
    }

    // update (dt) {},
});
