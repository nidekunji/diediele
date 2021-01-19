const debug = require('debug')('services[OrderService]')
const moment = require('moment')
const ERRORS = require('../constants').ERRORS
const knex = require('./knex')
const configs = require('../config')
var wxpay = require('../wxpay');

/**
 * 创建订单
 * @param {*} param0 
 */
function create({uid, openid, total, zongzi_code, ip, notify_url}) {
    const orderId = genOrderID();
    return knex('t_order').insert({
        order_id: orderId,
        uid,
        open_id: openid,
        total,
        zongzi_code,
        status: 0,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss')
    })
    .then(() => {
        return new Promise(function(resolve, reject) {
            wxpay.init({
                appid: configs.wxpay.appid,
                mch_id: configs.wxpay.mch_id,
                apiKey: configs.wxpay.apiKey
            });
            wxpay.getBrandWCPayRequestParams({
                body: 'Q版粽子',
                out_trade_no: orderId,
                total_fee: total,
                spbill_create_ip: ip,
                notify_url: notify_url,
                trade_type: 'JSAPI',
                product_id: zongzi_code,
                openid: openid
            }, function(err, result) {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    })
    .then(payment => ({order_id: orderId, payment: payment}))
    .catch(e => {
        debug('%s: %O', ERRORS.SERVICEERR.ERR_WHEN_CREATE_ORDER, e)
        throw new Error(`${ERRORS.SERVICEERR.ERR_WHEN_CREATE_ORDER}\n${e}`)
    })
}

/**
 * 更新订单信息
 * @param {String} order_id 
 * @param {Object} param1 
 */
function update(order_id, {status}) {
    if (!order_id) {
        throw new Error(`${ERRORS.REQERR.ERR_ORDER_ID}`)
    }
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = {update_time: currentTime}
    if (typeof(status) !== 'undefined') {
        data.status = status;
        if (status == 1) {
            data.pay_time = currentTime;
        }
    }
    return knex('t_order')
        .update(data)
        .where({order_id})
        .catch(e => {
            debug('%s: %O', ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB, e)
            throw new Error(`${ERRORS.DBERR.ERR_WHEN_UPDATE_TO_DB}\n${e}`)
        })
}

/**
 * 查询订单信息
 * @param {String} order_id 
 */
function getOrderById(order_id) {
    return knex('t_order')
        .select('*')
        .where({
            order_id
        })
        .then(result => {
            if (!Array.isArray(result) || result.length === 0) {
                return null
            } else {
               return result[0]
            }
        })
        .catch(e => {
            debug('%s: %O', ERRORS.DBERR.ERR_WHEN_QUERY_DB, e)
            throw new Error(`${ERRORS.DBERR.ERR_WHEN_QUERY_DB}\n${e}`)
        })
}

function genOrderID() {
    return moment().format('YYYYMMDDHHmmss') + Math.random().toString().substr(2, 6);
}

module.exports = {
    create,
    update,
    getOrderById
}