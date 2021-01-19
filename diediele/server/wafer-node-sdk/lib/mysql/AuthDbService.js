const debug = require('debug')('qcloud-sdk[AuthDbService]')
const uuidGenerator = require('uuid/v4')
const moment = require('moment')
const ERRORS = require('../constants').ERRORS
const mysql = require('./index')

/**
 * 储存登录信息
 * @param {string} openId
 * @param {string} sessionKey
 * @return {Promise}
 */
function saveLoginData (openId, skey, session_key) {
    const uuid = uuidGenerator()
    const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    const last_visit_time = create_time
    const open_id = openId
    const columns = '*';
    const userinfo = {}

    // 查重并决定是插入还是更新数据
    return mysql('t_user').first(columns).where({
        open_id
    })
    .then(row => {
        // 如果存在用户则更新
        if (row) {
            return mysql('t_user').update({
                skey, last_visit_time, session_key
            }).where({
                open_id
            }).then(() => (row))
        } else {
            return mysql('t_user').insert({
                uuid, skey, create_time, last_visit_time, open_id, session_key
            }).then((res) => ({uid: res[0]}))
        }
    })
    .then((res) =>   ({
        userinfo: res,
        skey: skey
    }))
    .catch(e => {
        debug('%s: %O', ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB, e)
        throw new Error(`${ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB}\n${e}`)
    })
}

/**
 * 通过 skey 获取用户信息
 * @param {string} skey 登录时颁发的 skey 为登录态标识
 */
function getUserInfoBySKey (skey) {
    if (!skey) throw new Error(ERRORS.DBERR.ERR_NO_SKEY_ON_CALL_GETUSERINFOFUNCTION)

    return mysql('t_user').select('*').where({
        skey
    })
}

module.exports = {
    saveLoginData,
    getUserInfoBySKey
}
