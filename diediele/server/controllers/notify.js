var wxpay = require('../wxpay');
var configs = require('../config');
var OrderService = require('../services/OrderService');
var utils = require('../wxpay/lib/utils')

// 接收支付异步通知
module.exports = async function(ctx, next) {
    var success = function(){ ctx.body = utils.buildXML({ xml: { return_code:'SUCCESS' } }); };
    var fail = function(msg){ ctx.body = utils.buildXML({ xml: { return_code:'FAIL', return_msg: msg } }); };
    var data = await utils.pipe(ctx.req)
        .then(data => (data))
        .catch(e => {
            fail(e.message);
        });
    var xml = data.toString('utf8');
    utils.parseXML(xml, async function(err, msg){
        // 验证签名
        if (!utils.checkSign(msg, configs.wxpay.apiKey)) {
            fail('sign check error');
            return;
        }
        // 验证appid和商户号
        if (configs.wxpay.appid != msg.appid || configs.wxpay.mch_id != msg.mch_id) {
            fail('error appid or mch_id');
            return;
        }
        // 验证return_code和result_code
        if (msg.return_code == "FAIL" || msg.result_code == "FAIL") {
            fail('result fail');
            return;
        }
        success();
        // 处理商户业务逻辑
        let {openid, total_fee, out_trade_no} = msg;
        total_fee = parseInt(total_fee);
        let order = await OrderService.getOrderById(out_trade_no);
        // 若订单不存在，直接退出
        if (!order) {
            return;
        }
        // 验证订单状态，防止重复处理
        if (order.status != 0) {
            return;
        }
        // 验证openid
        if (order.open_id != openid) {
            return;
        }
        // 验证订单金额
        if (order.total != total_fee) {
            return;
        }
        // 更新订单状态
        await OrderService.update(out_trade_no, {
            "status": 1
        });
        // 更新业务状态
        //await ZongziService.updateStatusByOrderId(out_trade_no);
    });
}
