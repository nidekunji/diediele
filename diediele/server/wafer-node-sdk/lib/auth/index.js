const debug = require('debug')('qcloud-sdk[auth]')
const http = require('axios')
const moment = require('moment')
const config = require('../../config')
const qcloudProxyLogin = require('../helper/qcloudProxyLogin')
const AuthDbService = require('../mysql/AuthDbService')
const sha1 = require('../helper/sha1')
const { ERRORS, LOGIN_STATE } = require('../constants')
const CustomError = require('../../../lib/CustomError')

/**
 * 授权模块
 * @param {express request} request
 * @return {Promise}
 * @example 基于 Express
 * authorization(this.req).then(userinfo => { // ...some code })
 */
function authorization (request) {
    const {
        'x-wx-code': code
    } = request.headers

    // 检查 headers
    if ([code].some(v => !v)) {
        debug(ERRORS.ERR_HEADER_MISSED)
        throw new CustomError(-1, ERRORS.ERR_HEADER_MISSED)
    }

    debug('Auth: code: %s', code)

    // 获取 session key
    return getSessionKey(code)
        .then(pkg => {
            const { session_key, openid } = pkg
            // 生成 3rd_session
            const skey = sha1(session_key)

            // 存储到数据库中
            return AuthDbService.saveLoginData(openid, skey, session_key).then(res => ({
                loginState: LOGIN_STATE.SUCCESS,
                skey: res.skey,
                userinfo: res.userinfo
            }))
        })
}

/**
 * 鉴权模块
 * @param {express request} req
 * @return {Promise}
 * @example 基于 Express
 * validation(this.req).then(loginState => { // ...some code })
 */
function validation (req) {
    const { 'x-wx-skey': skey } = req.headers
    if (!skey) throw new CustomError(-1, ERRORS.ERR_SKEY_INVALID)

    debug('Valid: skey: %s', skey)

    return AuthDbService.getUserInfoBySKey(skey)
        .then(result => {
            let userInfo = {}
            if (result.length === 0) throw new CustomError(-1, ERRORS.ERR_SKEY_INVALID)
            else userInfo = result[0]
            // 效验登录态是否过期
            const { last_visit_time: lastVisitTime } = userInfo
            const expires = config.wxLoginExpires && !isNaN(parseInt(config.wxLoginExpires)) ? parseInt(config.wxLoginExpires) * 1000 : 7200 * 1000

            if (moment(lastVisitTime, 'YYYY-MM-DD HH:mm:ss').valueOf() + expires < Date.now()) {
                debug('Valid: skey expired, login failed.')
                return {
                    loginState: LOGIN_STATE.FAILED,
                    userinfo: {}
                }
            } else {
                debug('Valid: login success.')
                return {
                    loginState: LOGIN_STATE.SUCCESS,
                    userinfo: userInfo
                }
            }
        })
}

/**
 * Koa 授权中间件
 * 基于 authorization 重新封装
 * @param {koa context} ctx koa 请求上下文
 * @return {Promise}
 */
function authorizationMiddleware (ctx, next) {
    return authorization(ctx.request).then(result => {
        ctx.state.$wxInfo = result
        return next()
    })
}

/**
 * Koa 鉴权中间件
 * 基于 validation 重新封装
 * @param {koa context} ctx koa 请求上下文
 * @return {Promise}
 */
function validationMiddleware (ctx, next) {
    return validation(ctx.req).then(result => {
        ctx.state.$wxInfo = result
        return next()
    })
}

/**
 * session key 交换
 * @param {string} appid
 * @param {string} appsecret
 * @param {string} code
 * @return {Promise}
 */
function getSessionKey (code) {
    const useQcloudLogin = config.useQcloudLogin

    // 使用腾讯云代小程序登录
    if (useQcloudLogin) {
        const { qcloudSecretId, qcloudSecretKey } = config
        return qcloudProxyLogin(qcloudSecretId, qcloudSecretKey, code).then(res => {
            res = res.data
            if (res.code !== 0 || !res.data.openid || !res.data.session_key) {
                debug('%s: %O', ERRORS.ERR_GET_SESSION_KEY, res)
                throw new CustomError(-1, `${ERRORS.ERR_GET_SESSION_KEY}\n${JSON.stringify(res)}`)
            } else {
                debug('openid: %s, session_key: %s', res.data.openid, res.data.session_key)
                return res.data
            }
        })
    } else {
        const appid = config.appId
        const appsecret = config.appSecret

        return http({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            method: 'GET',
            params: {
                appid: appid,
                secret: appsecret,
                js_code: code,
                grant_type: 'authorization_code'
            }
        }).then(res => {
            res = res.data
            if (res.errcode || !res.openid || !res.session_key) {
                debug('%s: %O', ERRORS.ERR_GET_SESSION_KEY, res.errmsg)
                throw new CustomError(-1, `${ERRORS.ERR_GET_SESSION_KEY}\n${JSON.stringify(res)}`)
            } else {
                debug('openid: %s, session_key: %s', res.openid, res.session_key)
                return res
            }
        })
    }
}

module.exports = {
    authorization,
    validation,
    authorizationMiddleware,
    validationMiddleware
}
