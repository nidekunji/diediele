const WechatService = require('../services/WechatService')
async function decrypt(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        const {iv, encryptedData} = ctx.request.body;
        ctx.state.data = WechatService.decrypt(userinfo.session_key, iv, encryptedData);
    } else {
        ctx.state.code = -1
    }
}

async function acode(ctx, next) {
    var file = await WechatService.getWxaCodeUnlimit(ctx.query);
    ctx.set('Content-disposition','attachment;filename='+'wxacode.jpg');
    ctx.set('Content-type','image/jpeg');
    ctx.body = file.data;
}
module.exports = {
    decrypt,
    acode
}