const debug = require('debug')('services[UserService]')
const moment = require('moment')
const {ERRORS, SCENES} = require('../constants')
const CustomError = require('../lib/CustomError')
const knex = require('./knex')

/**
 * 保存用户信息
 * @param {Number} uid
 * @param {Object} userInfo
 * @return {Promise}
 */
function saveUserInfo (uid, userInfo) {
    const {avatar_url, city, country, gender, language, nickname, province, last_lottery_draw_time, last_open_timed_bag_time, ld_day_share_times, ld_chance, ld_last_share_time} = userInfo;
    return knex('t_user').update({
        avatar_url, city, country, gender, language, nickname, province, last_lottery_draw_time, last_open_timed_bag_time, ld_day_share_times, ld_chance, ld_last_share_time
    }).where({
        uid
    })
    .catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
        throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, `${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
    })
}

/**
 * 获取用户信息
 * @param {*} uid 
 */
function getUserById (uid) {
    if (!uid) throw new CustomError(ERRORS.SERVICEERR.ERR_UID, ERRORS.SERVICEERR.ERR_UID);

    return knex('t_user').select('*').where({
        uid
    }).then(result => {
        if (result.length === 0) throw new CustomError(ERRORS.SERVICEERR.ERR_UID, ERRORS.SERVICEERR.ERR_UID)
        return result[0];
    })
}

/**
 * 保存好友关系
 * @param {Number} uid1 
 * @param {Number} uid2 
 * @returns {Promise}
 */
function saveUserRelation (uid1, uid2) {
    return knex('t_user_relation')
        .insert({uid1, uid2})
        .then(function(){
            return knex('t_user_relation').insert({uid1:uid2, uid2:uid1}).catch(function(){});
        })
        .catch(function() {})
}

/**
 * 获取用户消息列表
 * @param {Number} uid 
 * @param {Number} scene
 */
function getUserMessages (uid, scene) {
    if (!uid) {
        debug('%s: %s', ERRORS.SERVICEERR.ERR_UID, uid)
        throw new CustomError(ERRORS.SERVICEERR.ERR_UID, `${ERRORS.SERVICEERR.ERR_UID}\n${uid}`)
    }
    return knex("t_user_message").select(['id','type', 'content']).whereIn('scene', [SCENES.ALL, scene]).andWhere({uid: uid});
}

/**
 * 新增用户消息
 * @param {*} param0 消息对象
 * @returns {Promise}
 * @throws {CustomError} ERR_WHEN_INSERT_TO_DB
 */
function addUserMessage ({uid, type, scene, content}) {
    const create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    return knex("t_user_message").insert({uid, type, scene, content, create_time}).catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB, e)
        throw new CustomError(ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB, `${ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB}\n${e}`)
    });
}

/**
 * 删除用户消息
 * @param {Number} uid 
 * @param {Number} msgid 
 */
function deleteUserMessage (uid, msgid) {
    return knex("t_user_message").delete().where({uid: uid, id: msgid}).catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_DELETE_FROM_DB, e)
        throw new CustomError(ERRORS.DBERR.ERR_WHEN_DELETE_FROM_DB, `${ERRORS.DBERR.ERR_WHEN_DELETE_FROM_DB}\n${e}`)
    });
}

/**
 * 增加闯关进度
 * @param {*} uid 
 * @param {*} amount 
 * @returns {Promise}
 */
function incrementLevel(uid, amount = 1) {
    return knex('t_user').where({uid: uid}).increment('level', amount).catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
        throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, `${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
    });
}

/**
 * 更新最高挑战关卡
 * @param {Number} uid 
 * @param {Number} max_level 
 * @returns {Promise}
 */
function updateMaxLevel(uid, max_level) {
    return knex('t_user').where({uid: uid}).update({max_level: max_level}).catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
        throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, `${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
    });
}

/**
 * 提升段位
 * @param {*} uid 
 * @param {*} amount 
 * @returns {Promise}
 */
function incrementParagraphLevel(uid, amount = 1) {
    return knex('t_user').where({uid: uid}).increment('paragraph_level', amount).catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
        throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, `${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
    });
}

/**
 * 增加金币数量
 * @param {*} uid 
 * @param {*} amount 
 * @returns {Promise}
 * @throws {CustomError} ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB
 */
function incrementGoldcoin(uid, amount = 1, transaction) {
    if (amount >= 0) {
        return knex('t_user').transacting(transaction).where({uid: uid}).increment('goldcoin', amount).catch(e => {
            debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
            throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, `${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
        });
    } else {
        return knex('t_user').transacting(transaction).where({uid: uid}).andWhereRaw(knex.raw("goldcoin >= ?", [Math.abs(amount)])).increment('goldcoin', amount).catch(e => {
            debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
            throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, `${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
        });
    }
}

/**
 * 增加爱心数量
 * @param {*} uid 
 * @param {*} amount 
 * @returns {Promise}
 */
function incrementLove(uid, amount = 1, transaction) {
    if (amount >= 0) {
        return knex('t_user').transacting(transaction).where({uid: uid}).increment('love', amount).catch(e => {
            debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
            throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, `${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
        });
    } else {
        return knex('t_user').transacting(transaction).where({uid: uid}).andWhereRaw(knex.raw("love >= ?", [Math.abs(amount)])).increment('love', amount).catch(e => {
            debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
            throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, `${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
        });
    }
}

module.exports = {
    saveUserInfo,
    saveUserRelation,
    getUserById,
    getUserMessages,
    addUserMessage,
    deleteUserMessage,
    incrementLevel,
    updateMaxLevel,
    incrementParagraphLevel,
    incrementGoldcoin,
    incrementLove
}
