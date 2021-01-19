const debug = require('debug')('services[RankService]')
const moment = require('moment')
const {ERRORS} = require('../constants')
const knex = require('./knex')
const CustomError = require('../lib/CustomError')

/**
 * 获取世界排行榜
 * @param {Number} type 排行类型
 * @return {Promise}
 * @throws {CustomError}
 */
function getRankAll (type) {
    let selectColumns = ['avatar_url', 'nickname'];
    let sortColumn = '';
    const limit = 200;
    switch(type) {
        case 1: {
            selectColumns.push('receive_count')
            sortColumn = 'receive_count'
            break;
        }
        case 2: {
            selectColumns.push('send_receive_count')
            sortColumn = 'send_receive_count'
            break;
        }
        default: {
            throw new CustomError(`${ERRORS.REQERR.ERR_UNKNOWN_TYPE}`)
        }
    }
    return knex('t_user').select().column(selectColumns).where(sortColumn, '>', 0).orderBy(sortColumn, 'desc').limit(limit)
    .then(rank => (rank))
    .catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_QUERY_DB, e)
        throw new CustomError(`${ERRORS.DBERR.ERR_WHEN_QUERY_DB}\n${e}`)
    })
}

/**
 * 
 * @param {*} userinfo 
 * @param {*} type 
 * @throws {CustomError}
 */
function getMyRankAll(userinfo, type) {
    let sortColumn = '';
    switch(type) {
        case 1: {
            sortColumn = 'receive_count'
            break;
        }
        case 2: {
            sortColumn = 'send_receive_count'
            break;
        }
        default: {
            throw new CustomError(`${ERRORS.REQERR.ERR_UNKNOWN_TYPE}`)
        }
    }
    return knex('t_user').count('uid as num')
    .where(sortColumn, '>', userinfo[sortColumn])
    .then(res => {
        if (res.length > 0) {
            return {myRank: res[0].num + 1, myCount: userinfo[sortColumn]};
        } else {
            return {myRank: 1, myCount: userinfo[sortColumn]};
        }
    })
    .catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_QUERY_DB, e)
        throw new CustomError(`${ERRORS.DBERR.ERR_WHEN_QUERY_DB}\n${e}`)
    })
}

/**
 * 
 * @param {*} userinfo 
 * @param {*} type 
 * @throws {CustomError}
 */
function getMyRankFriend(userinfo, type) {
    let sortColumn = '';
    switch(type) {
        case 1: {
            sortColumn = 'receive_count'
            break;
        }
        case 2: {
            sortColumn = 'send_receive_count'
            break;
        }
        default: {
            throw new CustomError(`${ERRORS.REQERR.ERR_UNKNOWN_TYPE}`)
        }
    }
    return knex('t_user_relation').select().column('uid2').where({uid1: userinfo.uid})
    .then((friends) => {
        var uids = [];
        if(Array.isArray(friends)) {
            uids = friends.map(function(item) {
                return item.uid2;
            });
        }
        return knex('t_user')
            .count('uid as num')
            .whereIn('uid', uids)
            .where(sortColumn, '>', userinfo[sortColumn])
            .then(res => {
                if (res.length > 0) {
                    return {myRank: res[0].num + 1, myCount: userinfo[sortColumn]};
                } else {
                    return {myRank: 1, myCount: userinfo[sortColumn]};
                }
            })
            .catch(e => {
                debug('%s: %O', ERRORS.DBERR.ERR_WHEN_QUERY_DB, e)
                throw new CustomError(`${ERRORS.DBERR.ERR_WHEN_QUERY_DB}\n${e}`)
            })
    })
    .then(res => (res))
    .catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_QUERY_DB, e)
        throw new CustomError(`${ERRORS.DBERR.ERR_WHEN_QUERY_DB}\n${e}`)
    })
}

/**
 * 获取好友排行榜
 * @param {Number} uid 用户ID
 * @param {Number} type 排行类型，1:收到的粽子数量排行；2:发送的粽子数量排行
 * @throws {CustomError}
 */
function getRankFriend (uid, type) {
    let selectColumns = ['avatar_url', 'nickname'];
    let sortColumn = '';
    const limit = 100;
    switch(type) {
        case 1: {
            selectColumns.push('receive_count')
            sortColumn = 'receive_count'
            break;
        }
        case 2: {
            selectColumns.push('send_receive_count')
            sortColumn = 'send_receive_count'
            break;
        }
        default: {
            throw new CustomError(`${ERRORS.REQERR.ERR_UNKNOWN_TYPE}`)
        }
    }
    return knex('t_user_relation').select().column('uid2').where({uid1: uid})
    .then((friends) => {
        var uids = [];
        if(Array.isArray(friends)) {
            uids = friends.map(function(item) {
                return item.uid2;
            });
        }
        uids.push(uid);
        return knex('t_user').select()
            .column(selectColumns)
            .whereIn('uid', uids)
            .orderBy(sortColumn, 'desc')
            .limit(limit)
            .catch(e => {
                debug('%s: %O', ERRORS.DBERR.ERR_WHEN_QUERY_DB, e)
                throw new CustomError(`${ERRORS.DBERR.ERR_WHEN_QUERY_DB}\n${e}`)
            })
    })
    .then(rank => (rank))
    .catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_QUERY_DB, e)
        throw new CustomError(`${ERRORS.DBERR.ERR_WHEN_QUERY_DB}\n${e}`)
    })
}

module.exports = {
    getRankAll,
    getMyRankAll,
    getRankFriend,
    getMyRankFriend
}
