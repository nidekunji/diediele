const debug = require('debug')('services[ThemeService]')
const moment = require('moment')
const knex = require('./knex')
const {PAY_TYPE, ERRORS, USER_THEME_BUY_RECORD_STATUS} = require('../constants')
const CustomError = require('../lib/CustomError')
const UserService = require('../services/UserService')
const OrderService = require('../services/OrderService')

/**
 * 获取所有的主题（皮肤）
 * @returns {Array<Object>} 主题（皮肤）数组
 */
function getThemes() {
    return [
        {
            id: "default",
            name: "默认皮肤",
            thumb: "https://diediele-1256658787.cos.ap-guangzhou.myqcloud.com/theme_covers/default.png",
            paytype: PAY_TYPE.GOLD_COIN,
            total: 0
        },
        {
            id: "animal",
            name: "动物世界",
            thumb: "https://diediele-1256658787.cos.ap-guangzhou.myqcloud.com/theme_covers/animal.png",
            paytype: PAY_TYPE.LOVE,
            total: 500
        },
        {
            id: "piggy",
            name: "小猪佩奇",
            thumb: "https://diediele-1256658787.cos.ap-guangzhou.myqcloud.com/theme_covers/piggy.png",
            paytype: PAY_TYPE.LOVE,
            total: 500
        }
    ];
}
/**
 * 根据主题（皮肤）ID获取主题（皮肤）信息
 * @param {String} themeID 
 * @param {Boolean} throwException 未找到主题时是否抛出异常
 * @returns {Object|null} 主题（皮肤）信息
 * @throws {CustomError} ERRORS.SERVICEERR.ERR_THEME_NOT_FOUND
 */
function getThemeByID(themeID, throwException = false) {
    let themes = getThemes();
    themes = themes.filter(function(theme) {
        return theme.id == themeID;
    });
    if (themes.length > 0) {
        return themes[0];
    }
    if (throwException) {
        throw new CustomError(ERRORS.SERVICEERR.ERR_THEME_NOT_FOUND, ERRORS.SERVICEERR.ERR_THEME_NOT_FOUND);
    }
}

/**
 * 
 * @param {{uid: Number, themes: String}} user 
 * @param {String} theme_id 
 * @param {knex.transaction} transaction 
 * @throws {CustomError}
 */
function addUserTheme(user, theme_id, transaction) {
    if (!user) {
        debug('%s', ERRORS.SERVICEERR.ERR_USER)
        throw new CustomError(ERRORS.SERVICEERR.ERR_USER, ERRORS.SERVICEERR.ERR_USER)
    }
    let themes = [];
    if (user.themes) {
        themes = user.themes.split(",");
    }
    if (themes.includes(theme_id)) {
        debug('%s', ERRORS.SERVICEERR.ERR_USER_THEME_EXISTS)
        throw new CustomError(ERRORS.SERVICEERR.ERR_USER_THEME_EXISTS, ERRORS.SERVICEERR.ERR_USER_THEME_EXISTS)
    }
    themes.push(theme_id);
    return knex("t_user").transacting(transaction).update({
        themes: themes.join(",")
    })
    .where({uid: user.uid})
    .catch(e => {
        debug('%s', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB)
        throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB)
    });
}

/**
 * 添加用户主题购买记录
 * @param {Object} user 
 * @param {Object} theme 
 * @param {Number} status 
 * @param {String} order_id 
 */
function addUserThemeBuyRecord({user, theme, status, order_id, transaction}) {
    const create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    return knex("t_user_theme_buy_record").transacting(transaction).insert({
        uid: user.uid,
        theme_id: theme.id,
        order_id: order_id,
        paytype: theme.paytype,
        total: theme.total,
        status: status,
        create_time: create_time
    })
}

/**
 * 通用购买
 * @param {Object} user 
 * @param {Number} theme_id 
 * @param {Object} ctx context
 */
async function buy(user, theme_id, ctx) {
    let result = {};
    let theme = await getThemeByID(theme_id, true);
    // 根据不同付款类型进行相应的操作
    switch(theme.paytype) {
        // 金币
        case PAY_TYPE.GOLD_COIN: {
            await buyWithGoldCoin(user, theme);
            break;
        }
        // 爱心
        case PAY_TYPE.LOVE: {
            await buyWithLove(user, theme);
            break;
        }
        // 人民币
        case PAY_TYPE.RMB: {
            result = await buyWithRMB(user, theme, ctx);
            break;
        }
        default: {
            ctx.state.code = ERRORS.DATAERR.ERR_UNKNOWN_PAYTYPE;
            break;
        }
    }
    return result;
}

/**
 * 使用金币购买
 * @param {Object} user 
 * @param {Object} theme 
 * @throws {CustomError}
 */
function buyWithGoldCoin(user, theme) {
    if (user.goldcoin < theme.total) {
        throw new CustomError(ERRORS.SERVICEERR.ERR_LACK_OF_GOLDCOIN, ERRORS.SERVICEERR.ERR_LACK_OF_GOLDCOIN);
    }
    return knex.transaction(function(trx){
        // 扣除用户金币数量
        UserService.incrementGoldcoin(user.uid, -theme.total, trx)
        .then((res) => {
            if (!res) {
                throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB);
            } else {
                // 添加用户主题购买记录
                return addUserThemeBuyRecord({
                    user,
                    theme,
                    status: USER_THEME_BUY_RECORD_STATUS.PAYED,
                    transaction: trx
                })
                .then(() => {
                    // 添加用户主题
                    return addUserTheme(user, theme.id, trx);
                })
            }
        })
        .then(() => {
            trx.commit();
        })
        .catch(e => {
            trx.rollback(e);
        });
    })
    .then(function(){
        return true;
    })
    .catch(function(e){
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_EXEC_TRANSACTION, e)
        throw new CustomError(`${ERRORS.DBERR.ERR_WHEN_EXEC_TRANSACTION}\n${e}`)
    })
}

/**
 * 使用爱心购买
 * @param {Object} user 
 * @param {Object} theme 
 * @throws {CustomError}
 */
function buyWithLove(user, theme) {
    if (user.love < theme.total) {
        throw new CustomError(ERRORS.SERVICEERR.ERR_LACK_OF_LOVE, ERRORS.SERVICEERR.ERR_LACK_OF_LOVE);
    }
    return knex.transaction(function(trx){
        // 扣除用户爱心数量
        UserService.incrementLove(user.uid, -theme.total, trx)
        .then((res) => {
            if (!res) {
                throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB);
            } else {
                // 添加用户主题购买记录
                return addUserThemeBuyRecord({
                    user,
                    theme,
                    status: USER_THEME_BUY_RECORD_STATUS.PAYED,
                    transaction: trx
                })
                .then(() => {
                    // 添加用户主题
                    return addUserTheme(user, theme.id, trx);
                })
            }
        })
        .then(() => {
            trx.commit();
        })
        .catch(e => {
            trx.rollback(e);
        });
    })
    .then(function(){
        return true;
    })
    .catch(function(e){
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_EXEC_TRANSACTION, e)
        throw new CustomError(`${ERRORS.DBERR.ERR_WHEN_EXEC_TRANSACTION}\n${e}`)
    })
}

/**
 * 使用人民币购买
 * @param {*} user 
 * @param {*} theme 
 */
function buyWithRMB(user, theme, ctx) {
    // 创建订单
    return OrderService.create({
        uid: user.uid,
        openid: user.open_id,
        total: theme.total,
        theme_id: theme.id,
        ip: '127.0.0.1',
        notify_url: ctx.request.origin + '/weapp/notify'
    })
    .then(({order_id, payment}) => {
        // 更新用户购买记录表的订单号
        //ThemeService.update(theme_id, {order_id});
        return {
            order_id,
            payment
        }
    });

}

module.exports = {
    getThemes,
    getThemeByID,
    buy,
    addUserTheme
}