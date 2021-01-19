const debug = require('debug')('services[ConsumeService]')
const {ERRORS, PROP_TYPE} = require('../constants')
const UserService = require('./UserService');
const CustomError = require('../lib/CustomError')

/**
 * 发放奖励
 * @param {Number} uid
 * @param {Array<Object>} consumes 
 */
async function consume(uid, ...consumes) {
    let goldcoinAmount = 0;
    let loveAmount = 0;
    consumes.forEach(function(item) {
        switch(item.type) {
            case PROP_TYPE.GOLD_COIN : {
                goldcoinAmount += item.amount;
                break;
            }
            case PROP_TYPE.LOVE : {
                loveAmount += item.amount;
                break;
            }
            default : break;
        }
    });
    if (goldcoinAmount > 0) {
        const res = await UserService.incrementGoldcoin(uid, -goldcoinAmount);
        if (!res) {
            debug('%s', ERRORS.SERVICEERR.ERR_LACK_OF_GOLDCOIN)
            throw new CustomError(ERRORS.SERVICEERR.ERR_LACK_OF_GOLDCOIN, `${ERRORS.SERVICEERR.ERR_LACK_OF_GOLDCOIN}`)
        }
    }
    if (loveAmount > 0) {
        const res = await UserService.incrementLove(uid, -loveAmount);
        if (!res) {
            debug('%s', ERRORS.SERVICEERR.ERR_LACK_OF_LOVE)
            throw new CustomError(ERRORS.SERVICEERR.ERR_LACK_OF_LOVE, `${ERRORS.SERVICEERR.ERR_LACK_OF_LOVE}`)
        }
    }
}

module.exports = {
    consume
}