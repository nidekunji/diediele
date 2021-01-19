const {PROP_TYPE} = require('../Utils/Constants');
function set(type, amount) {
    switch(type) {
        case PROP_TYPE.GOLD_COIN: {
            var node = cc.find("Canvas/head/goldcoin");
            if (node) {
                node.getComponent(cc.Label).string = amount;
            }
            break;
        }
        case PROP_TYPE.LOVE: {
            var node = cc.find("Canvas/head/love");
            if (node) {
                node.getComponent(cc.Label).string = amount;
            }
            break;
        }
        default: break;
    }
}
function consume(type, amount) {
    switch(type) {
        case PROP_TYPE.GOLD_COIN: {
            window.userInfo.goldcoin -= amount;
            set(type, window.userInfo.goldcoin);
            break;
        }
        case PROP_TYPE.LOVE: {
            window.userInfo.love -= amount;
            set(type, window.userInfo.love)
            break;
        }
        default: break;
    }
}
function prize(...prizes) {
    prizes.forEach(prize => {
        switch(prize.type) {
            case PROP_TYPE.GOLD_COIN: {
                window.userInfo.goldcoin += prize.amount;
                set(prize.type, window.userInfo.goldcoin);
                break;
            }
            case PROP_TYPE.LOVE: {
                window.userInfo.love += prize.amount;
                set(prize.type, window.userInfo.love);
                break;
            }
            case PROP_TYPE.THEME: {
                if (Array.isArray(window.userInfo.themes) && !window.userInfo.themes.includes(prize.theme_id)) {
                    window.userInfo.themes.push(prize.theme_id);
                    window.platform.setUserInfoStorage();
                }
                break;
            }
            default: break;
        }
    });
}
module.exports = {
    set,
    consume,
    prize
}