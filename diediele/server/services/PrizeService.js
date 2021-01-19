const UserService = require('./UserService');
const ThemeService = require('./ThemeService');
const {PROP_TYPE} = require('../constants');
/**
 * 获取登录奖励列表(从星期日到星期一)
 * @returns {Array<Array<{type: Number, amount: Number, icon: String}>>} 奖励列表(二维数组), 其中第一项表示周日奖励(数组)
 */
function getLoginPrizes() {
    return [
        // 周日
        [
            {
                type: PROP_TYPE.GOLD_COIN,
                amount: 700,
                icon: "gold5"
            }
        ],
        // 周一
        [
            {
                type: PROP_TYPE.GOLD_COIN,
                amount: 100,
                icon: "gold1"
            }
        ],
        // 周二
        [
            {
                type: PROP_TYPE.LOVE,
                amount: 20,
                icon: "love1"
            }
        ],
        // 周三
        [
            {
                type: PROP_TYPE.GOLD_COIN,
                amount: 200,
                icon: "gold2"
            }
        ],
        // 周四
        [
            {
                type: PROP_TYPE.GOLD_COIN,
                amount: 300,
                icon: "gold3"
            }
        ],
        // 周五
        [
            {
                type: PROP_TYPE.LOVE,
                amount: 50,
                icon: "love2"
            }
        ],
        // 周六
        [
            {
                type: PROP_TYPE.GOLD_COIN,
                amount: 500,
                icon: "gold4"
            }
        ]
    ];
}

/**
 * 获取新注册用户奖励
 * @returns {Array<{type: Number, amount: Number}>} 奖励数组
 */
function getRegisterPrizes() {
    return [
        {
            type: PROP_TYPE.GOLD_COIN,
            amount: 1888
        }
    ];
}
/**
 * 获取分享到群的奖励
 */
function getShareToGroupPrizes() {
    return [
        {
            type: PROP_TYPE.GOLD_COIN,
            amount: 500
        }
    ];
}

/**
 * 获取抽奖奖池
 * @returns {Array<Object>}
 */
function getLotteryDrawPrizes() {
    return [
        {
            id: 1,
            type: PROP_TYPE.GOLD_COIN,
            amount: 50,
            icon: 'gold1',
            probability: 30
        },
        {
            id: 2,
            type: PROP_TYPE.LOVE,
            amount: 20,
            icon: 'love1',
            probability: 30
        },
        {
            id: 3,
            type: PROP_TYPE.GOLD_COIN,
            amount: 100,
            icon: 'gold2',
            probability: 20
        },
        {
            id: 4,
            type: PROP_TYPE.GOLD_COIN,
            amount: 200,
            icon: 'gold3',
            probability: 10
        },
        {
            id: 5,
            type: PROP_TYPE.LOVE,
            amount: 50,
            icon: 'love2',
            probability: 5
        },
        {
            id: 6,
            type: PROP_TYPE.GOLD_COIN,
            amount: 300,
            icon: 'gold4',
            probability: 5
        }
    ];
}

/**
 * 获取限时礼包奖池
 * @param {{level: Number}} user {level: 用户闯关进度}
 * @returns {Array<{id: Number, type: Number, amount: Number, probability: Number}>} 奖励对象数组
 */
function getTimedBagPrizes({level}) {
    return [
        {
            id: 1,
            type: PROP_TYPE.GOLD_COIN,
            amount: 30,
            icon: 'gold1',
            probability: 30
        },
        {
            id: 2,
            type: PROP_TYPE.GOLD_COIN,
            amount: 50,
            icon: 'gold2',
            probability: 30
        },
        {
            id: 3,
            type: PROP_TYPE.GOLD_COIN,
            amount: 80,
            icon: 'gold2',
            probability: 30
        },
        {
            id: 4,
            type: PROP_TYPE.LOVE,
            amount: 5,
            icon: 'love1',
            probability: 10
        }
    ];
}

/**
 * 获取分享奖励
 * @returns {Array<{type: Number, amount: Number}>}
 */
function getSharePrizes() {
    return [
        {
            type: PROP_TYPE.GOLD_COIN,
            amount: 500
        }
    ];
}

/**
 * 通过星期获取奖励列表
 * @param {Number} day 0-6, 其中0表示星期日
 */
function getLoginPrizesByDay(day) {
    return getLoginPrizes()[day];
}

/**
 * 发放奖励
 * @param {Object} user 用户
 * @param {Array<{type: Number, amount: Number}>} prizes 奖励数组
 */
async function sendPrizes(user, ...prizes) {
    let goldcoinAmount = 0;
    let loveAmount = 0;
    let themeID = "";
    prizes.forEach(function(item) {
        switch(item.type) {
            case PROP_TYPE.GOLD_COIN : {
                goldcoinAmount += item.amount;
                break;
            }
            case PROP_TYPE.LOVE : {
                loveAmount += item.amount;
                break;
            }
            case PROP_TYPE.THEME : {
                themeID = item.theme_id;
            }
            default : break;
        }
    });
    if (goldcoinAmount > 0) {
        await UserService.incrementGoldcoin(user.uid, goldcoinAmount);
    }
    if (loveAmount > 0) {
        await UserService.incrementLove(user.uid, loveAmount);
    }
    if (themeID) {
        await ThemeService.addUserTheme(user, themeID);
    }
}

module.exports = {
    getLoginPrizes,
    getLoginPrizesByDay,
    getRegisterPrizes,
    getShareToGroupPrizes,
    getSharePrizes,
    getLotteryDrawPrizes,
    getTimedBagPrizes,
    sendPrizes
}