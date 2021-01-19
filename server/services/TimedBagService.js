const debug = require('debug')('services[LotteryDrawService]')
const PrizeService = require('./PrizeService')
const UserService = require('../services/UserService')
const moment = require('moment')
const CustomError = require('../lib/CustomError')
const {ERRORS} = require('../constants')
const FREQUENCY = 300; // 单位秒

/**
 * 打开限时礼包
 * @param {{uid: Number,level: Number,last_open_timed_bag_time: String}} user {uid: 用户ID, level: 用户闯关进度, last_open_timed_bag_time: 最近一次打开限时礼包的时间}
 * @returns {{prize: {type: Number, amount: Number}, timeLeft: Number}} {prize: 奖励, timeLeft: 剩余时间(秒)}
 */
async function open(user) {
    let prize = null;
    let {canOpenFlag, timeLeft} = canOpen(user);
    if (canOpenFlag) {
        let prizes = PrizeService.getTimedBagPrizes(user);
        let rand = Math.random() * 100;
        let count = 0;
        try {
            prizes.forEach(function(item) {
                count += item.probability;
                if (count >= rand) {
                    prize = Object.assign({}, item);
                    throw new Error("StopIteration");
                }
            });
        } catch (error) {
            
        }
        if (prize) {
            await UserService.saveUserInfo(user.uid, {last_open_timed_bag_time: moment().format('YYYY-MM-DD HH:mm:ss')});
            await PrizeService.sendPrizes(user, prize);
        }
    }
    return {prize, timeLeft};
}

/**
 * 强制打开限时礼包
 * @param {{uid: Number, level: Number}} user {uid: 用户ID, level: 用户闯关进度}
 * @returns {Number} 奖励ID
 */
async function forceOpen(user) {
    let prize = null;
    let prizes = PrizeService.getTimedBagPrizes(user);
    let rand = Math.random() * 100;
    let count = 0;
    try {
        prizes.forEach(function(item) {
            count += item.probability;
            if (count >= rand) {
                prize = Object.assign({}, item);
                throw new Error("StopIteration");
            }
        });
    } catch (error) {
        
    }
    if (prize) {
        await UserService.saveUserInfo(user.uid, {last_open_timed_bag_time: moment().format('YYYY-MM-DD HH:mm:ss')});
        await PrizeService.sendPrizes(user, prize);
    }
    return prize;
}

/**
 * 判断用户当前是否可以打开限时礼包
 * @param {{last_open_timed_bag_time: String}} param0 
 * @returns {{canOpenFlag: Boolean, timeLeft: Number}} {canOpenFlag: 是否可以打开, timeLeft: 剩余时间(秒)}
 */
function canOpen({last_open_timed_bag_time}) {
    if (typeof last_open_timed_bag_time === "undefined" || !last_open_timed_bag_time) {
        return {canOpenFlag: true, timeLeft: 0};
    }
    let canOpenFlag = false;
    let timeLeft = 0;
    // 当前时间
    let currentDate = new Date();
    // 最后一次抽奖时间
    let lastDate = (typeof last_open_timed_bag_time === "string") ? new Date(last_open_timed_bag_time) : last_open_timed_bag_time;
    if (lastDate.getTime() + FREQUENCY * 1000 < currentDate.getTime()) {
        canOpenFlag = true;
    } else {
        timeLeft = (lastDate.getTime() + FREQUENCY * 1000 - currentDate.getTime()) / 1000;
    }
    return {canOpenFlag, timeLeft};
}

module.exports = {
    FREQUENCY,
    open,
    forceOpen,
    canOpen
}