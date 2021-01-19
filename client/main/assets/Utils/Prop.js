const {PROP_TYPE, HP_TYPE} = require('../Utils/Constants');
function set(type, amount) {
 //   console.error(type, amount, 'type, amoutß');
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
        case PROP_TYPE.HP: {
            var node = cc.find("Canvas/head/hp");
            
            if (node) {
                node.getComponent(cc.Label).string = amount;
            }
            if (window.skipSence == 'Main') {
                let succPageHpNode = cc.find('Canvas/success/hp');
                if (succPageHpNode) {
                    succPageHpNode.getComponent(cc.Label).string = amount; 
                }
            }
            if(amount < HP_TYPE.MAX_HP) {
                if (window.hpRecoverTime == 'undefined' && window.userInfo.next_health_timeout > 0) {
                    window.hpRecoverTime = window.userInfo.next_health_timeout;
                    console.log(window.hpRecoverTime, '服务器时间');
                }
                if (!window.recoverHpIng) {
                    cc.game.emit("hp_recover_clock");
                }
            } else {
                cc.game.emit("hp_stopRecover_clock");

            }
            break;
        }
        default: break;
    }
}
function consume(type, amount) {
    switch(type) {
        case PROP_TYPE.GOLD_COIN: {
            window.userInfo.goldcoin += amount;
            set(type, window.userInfo.goldcoin);
            break;
        }
        case PROP_TYPE.LOVE: {
            window.userInfo.love += amount;
            set(type, window.userInfo.love)
            break;
        }
        case PROP_TYPE.HP: {
            window.userInfo.health += amount;
            set(type, window.userInfo.health);
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
            case PROP_TYPE.HP: {
                window.userInfo.health += prize.amount;
                set(prize.type, window.userInfo.health);
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