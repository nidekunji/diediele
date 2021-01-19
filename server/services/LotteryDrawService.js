const debug = require('debug')('services[LotteryDrawService]')
const PrizeService = require('./PrizeService')
const UserService = require('../services/UserService')
const moment = require('moment')
const CustomError = require('../lib/CustomError')
const {ERRORS} = require('../constants')
const MAX_SHARE_TIMES = 3;

/**
 * 
 * @param {Object} user 
 * @returns {Number} 奖励ID
 */
async function run(user) {
    let resultPrizeID = 0;
    if (canRun(user)) {
        let prizes = PrizeService.getLotteryDrawPrizes();
        let rand = Math.random() * 100;
        let count = 0;
        let prize = null;
        try {
            prizes.forEach(function(item) {
                count += item.probability;
                if (count >= rand) {
                    resultPrizeID = item.id;
                    prize = Object.assign({}, item);
                    throw new Error("StopIteration");
                }
            });
        } catch (error) {
            
        }
        if (user.ld_chance > 0) {
            user.ld_chance--;
            await UserService.saveUserInfo(user.uid, {last_lottery_draw_time: moment().format('YYYY-MM-DD HH:mm:ss'), ld_chance: user.ld_chance});
        } else {
            await UserService.saveUserInfo(user.uid, {last_lottery_draw_time: moment().format('YYYY-MM-DD HH:mm:ss')});
        }
        if (prize) {
            await PrizeService.sendPrizes(user, prize);
        }
    } else {
        debug('%s', ERRORS.SERVICEERR.ERR_LOTTERY_DRAW_NOT_ALLOWED)
        throw new CustomError(ERRORS.SERVICEERR.ERR_LOTTERY_DRAW_NOT_ALLOWED, ERRORS.SERVICEERR.ERR_LOTTERY_DRAW_NOT_ALLOWED)
    }
    return resultPrizeID;
}

async function forceRun(user) {
    let resultPrizeID = 0;
    let prizes = PrizeService.getLotteryDrawPrizes();
    let rand = Math.random() * 100;
    let count = 0;
    let prize = null;
    try {
        prizes.forEach(function(item) {
            count += item.probability;
            if (count >= rand) {
                resultPrizeID = item.id;
                prize = Object.assign({}, item);
                throw new Error("StopIteration");
            }
        });
    } catch (error) {
        
    }
    if (prize) {
        await UserService.saveUserInfo(user.uid, {last_lottery_draw_time: moment().format('YYYY-MM-DD HH:mm:ss')});
        await PrizeService.sendPrizes(user, prize);
    }
    return resultPrizeID;
}

/**
 * 获取剩余有效分享次数
 * @param {*} user 
 */
function getShareTimeRemain(user) {
    var lastShareDate = new Date(user.ld_last_share_time);
    var currentDate = new Date();
    if (currentDate.getFullYear() != lastShareDate.getFullYear() || currentDate.getMonth() != lastShareDate.getMonth() || currentDate.getDate() != lastShareDate.getDate()) {
        user.ld_day_share_times = 0;
    }
    return MAX_SHARE_TIMES - user.ld_day_share_times;
}

/**
 * 
 * @param {Object} user 
 * @returns {Number} 剩余有效分享次数
 */
async function share(user) {
    var lastShareDate = new Date(user.ld_last_share_time);
    var currentDate = new Date();
    if (currentDate.getFullYear() == lastShareDate.getFullYear() && currentDate.getMonth() == lastShareDate.getMonth() && currentDate.getDate() == lastShareDate.getDate()) {
        user.ld_day_share_times++;
        if (user.ld_day_share_times <= MAX_SHARE_TIMES) {
            user.ld_chance++;
        }
    } else {
        user.ld_day_share_times = 1;
        user.ld_chance++;
    }
    user.ld_last_share_time = moment().format('YYYY-MM-DD HH:mm:ss');
    await UserService.saveUserInfo(user.uid, {
        ld_day_share_times: user.ld_day_share_times,
        ld_last_share_time: user.ld_last_share_time,
        ld_chance: user.ld_chance
    });
    return MAX_SHARE_TIMES - user.ld_day_share_times;
}

function canRun({last_lottery_draw_time, ld_chance}) {
    if (typeof last_lottery_draw_time === "undefined") {
        return true;
    }
    // 当前时间
    let currentDate = new Date();
    // 最后一次抽奖时间
    let lastDate = (typeof last_lottery_draw_time === "string") ? new Date(last_lottery_draw_time) : last_lottery_draw_time;
    let canRunFlag = false;
    if (currentDate.getFullYear() > lastDate.getFullYear()) {
        canRunFlag = true;
    } else if (currentDate.getMonth() > lastDate.getMonth()){
        canRunFlag = true;
    } else if (currentDate.getDate() > lastDate.getDate()) {
        canRunFlag = true;
    } else if (ld_chance > 0) {
        canRunFlag = true;
    }
    return canRunFlag;
}

module.exports = {
    run,
    forceRun,
    canRun,
    share,
    getShareTimeRemain
}