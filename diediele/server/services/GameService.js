const debug = require('debug')('services[GameService]')
const {ERRORS, USER_MESSAGE_TYPE, SCENES} = require('../constants')
const ConsumeService = require('./ConsumeService')
const UserService = require('./UserService')
const PrizeService = require('./PrizeService')
const LevelService = require('./LevelService')
const CustomError = require('../lib/CustomError')

/**
 * 开始游戏
 * @param {Object} user 闯关玩家信息
 * @param {Number} level 关卡
 * @param {Number} help_seeker_id 求助者id
 * @returns {Array<Object>} consumes, 本次闯关消耗的道具
 * @throws {CustomError} ERR_USER | ERR_LEVEL
 */
async function start(user, level, help_seeker_id) {
    if (!user) {
        debug('%s: %s', ERRORS.SERVICEERR.ERR_USER, user)
        throw new CustomError(ERRORS.SERVICEERR.ERR_USER, `${ERRORS.SERVICEERR.ERR_USER}\n${user}`)
    }
    if (level == "undefined") {
        debug('%s: %s', ERRORS.SERVICEERR.ERR_LEVEL, level)
        throw new CustomError(ERRORS.SERVICEERR.ERR_LEVEL, `${ERRORS.SERVICEERR.ERR_LEVEL}\n${level}`)
    }
    let consumes = [];
    if (help_seeker_id) {
        // 有求助者的情况下，不消耗道具
    } else {
        if (level > user.level + 1) {
            // 关卡有误，非法挑战，抛出异常
            throw new CustomError(ERRORS.SERVICEERR.ERR_LEVEL, `${ERRORS.SERVICEERR.ERR_LEVEL}\n${level}`);
        } else {
            // 获取关卡配置
            let levelConfig = await LevelService.getLevelConfigByLevel(level, ['consumes', 'replay_consumes'], true);
            if (level > user.max_level) {
                consumes = JSON.parse(levelConfig.consumes);
                // 扣除道具
                await ConsumeService.consume(user.uid, ...consumes);
                // 更新最高挑战关卡
                await UserService.updateMaxLevel(user.uid, level);
            } else {
                // 获取重新闯关道具消耗
                consumes = JSON.parse(levelConfig.replay_consumes);
                // 扣除道具
                await ConsumeService.consume(user.uid, ...consumes);
            }
        }
    }
    return consumes;
}
/**
 * 闯关成功
 * @param {Object} user 闯关玩家信息
 * @param {Number} level 关卡
 * @param {Number} help_seeker_id 求助者id
 * @returns {Object} {prizes,upgradeLevel,newLevel}, 本次闯关获得的奖励
 * @throws {CustomError} ERR_USER | ERR_LEVEL
 */
async function success(user, level, help_seeker_id) {
    if (!user) {
        debug('%s: %s', ERRORS.SERVICEERR.ERR_USER, user)
        throw new CustomError(ERRORS.SERVICEERR.ERR_USER, `${ERRORS.SERVICEERR.ERR_USER}\n${user}`)
    }
    if (level == "undefined") {
        debug('%s: %s', ERRORS.SERVICEERR.ERR_LEVEL, level)
        throw new CustomError(ERRORS.SERVICEERR.ERR_LEVEL, `${ERRORS.SERVICEERR.ERR_LEVEL}\n${level}`)
    }
    // 获取关卡配置
    let levelConfig = await LevelService.getLevelConfigByLevel(level, 'prizes', true);
    let prizes = [];
    let upgradeLevel = false;
    let newLevel = user.level;
    if (help_seeker_id && user.uid != help_seeker_id) {
        // 有求助者的情况下
        let helpSeeker = await UserService.getUserById(help_seeker_id);
        if (helpSeeker.level < level) {
            prizes = JSON.parse(levelConfig.prizes);
            // 为求助者解锁关卡
            await UserService.incrementLevel(help_seeker_id);
            // 给求助者发放奖励
            await PrizeService.sendPrizes(helpSeeker, ...prizes);
            // 通知求助者
            await UserService.addUserMessage({
                uid: helpSeeker.uid,
                type: USER_MESSAGE_TYPE.FRIEND_HELP_SUCCESS,
                scene: SCENES.ALL,
                content: JSON.stringify({
                    helper_id: user.uid,
                    helper_openid: user.open_id,
                    prizes: prizes,
                    level: level
                })
            })
            // 给闯关玩家发放奖励
            await PrizeService.sendPrizes(user, ...prizes);
        }
    } else {
        // 没有求助者的情况下
        if (user.level < level) {
            prizes = JSON.parse(levelConfig.prizes);
            // 为闯关玩家解锁关卡
            await UserService.incrementLevel(user.uid);
            upgradeLevel = true;
            newLevel++;
            // 给闯关玩家发放奖励
            await PrizeService.sendPrizes(user, ...prizes);
        }
    }
    return {
        prizes: prizes,
        upgradeLevel: upgradeLevel,
        newLevel: newLevel
    };
}
function fail(user, level) {

}
/**
 * 分享到群获取奖励
 */
async function shareToGroupPrize(user) {
    let prizes = PrizeService.getShareToGroupPrizes();
    await PrizeService.sendPrizes(user, ...prizes);
    return prizes;
}
/**
 * 跳过关卡
 * @param {{uid: Number, level: Number}} 用户信息
 * @param {Number} level 要跳过的关卡
 * @returns {Number} newLevel
 */
async function skip(user, level) {
    let newLevel = user.level;
    if (user.level < level) {
        // 为闯关玩家解锁关卡
        await UserService.incrementLevel(user.uid);
        newLevel++;
    }
    return newLevel;
}
module.exports = {
    start,
    success,
    fail,
    skip,
    shareToGroupPrize
}