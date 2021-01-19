const debug = require('debug')('services[WechatService]')
const moment = require('moment')
const ERRORS = require('../constants').ERRORS
const knex = require('./knex')
const config = require('../config')
const http = require('axios')
const urllib = require('urllib')
const CustomError = require('../lib/CustomError')
const aesDecrypt = require('../wafer-node-sdk/lib/helper/aesDecrypt')

async function getWxaCodeUnlimit({scene = 'scene', page = '', width = 430, auto_color = true, line_color = {"r":"0","g":"0","b":"0"}, is_hyaline = true}) {
    var accessToken = await getAccessToken();
    var url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
    return urllib.request(url, {
        type: 'post',
        data: {scene, page, width, auto_color, line_color, is_hyaline},
        headers: {
            'content-type': 'application/json'
        }
    });
}

function decrypt(session_key, iv, encryptedData) {
    // 解密数据
    let decryptedData
    try {
        decryptedData = aesDecrypt(session_key, iv, encryptedData)
        decryptedData = JSON.parse(decryptedData)
    } catch (e) {
        debug('Auth: %s: %o', ERRORS.ERR_IN_DECRYPT_DATA, e)
        throw new CustomError(ERRORS.ERR_IN_DECRYPT_DATA, `${ERRORS.ERR_IN_DECRYPT_DATA}\n${e}`)
    }
    return decryptedData;
}

function getAccessToken() {
    return knex('t_wechat')
    .first('access_token', 'access_token_expire_time')
    .then(row => {
        if (row) {
            return row.access_token;
        } else {
            debug('%s', ERRORS.ERR_FETCH_ACCESS_TOKEN)
            throw new CustomError(ERRORS.ERR_FETCH_ACCESS_TOKEN, `${ERRORS.ERR_FETCH_ACCESS_TOKEN}`)
        }
    })
    .catch(e => {

    })
}

/**
 * 检查access token是否过期
 */
function checkAccessToken() {
    const currentTime = (new Date()).getTime() / 1000;
    let result = '';
    return knex('t_wechat')
        .first('access_token', 'access_token_expire_time')
        .then(row => {
            if (!row) {
                return fetchAccessToken();
            } else {
                const {access_token: accessToken, access_token_expire_time: accessTokenExpireTime} = row;
                if (accessTokenExpireTime  <= currentTime + 600) {
                    return fetchAccessToken();
                } else {
                    return {access_token: accessToken};
                }
            }
        })
        .then(({access_token, expires_in}) => {
            result = access_token;
            if (expires_in) {
                return saveAccessToken(access_token, currentTime + expires_in);
            } else {
                return access_token;
            }
        })
        .then(() => (result))
}

/**
 * 保存access_token
 * @param {*} access_token 
 * @param {*} access_token_expire_time 
 */
function saveAccessToken(access_token, access_token_expire_time) {
    return knex('t_wechat')
        .update({access_token, access_token_expire_time})
        .catch(e => {
            debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
            throw new CustomError(ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, `${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
        })
}

function fetchAccessToken() {
    const appid = config.appId
    const appsecret = config.appSecret

    return http({
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        method: 'GET',
        params: {
            appid: appid,
            secret: appsecret,
            grant_type: 'client_credential'
        }
    }).then(res => {
        res = res.data
        if (res.errcode || !res.access_token) {
            debug('%s: %O', ERRORS.ERR_FETCH_ACCESS_TOKEN, res.errmsg)
            throw new CustomError(ERRORS.ERR_FETCH_ACCESS_TOKEN, `${ERRORS.ERR_FETCH_ACCESS_TOKEN}\n${JSON.stringify(res)}`)
        } else {
            debug('access_token: %s, expires_in: %s', res.access_token, res.expires_in)
            return res
        }
    })
}

module.exports = {
    decrypt,
    getWxaCodeUnlimit,
    checkAccessToken
}