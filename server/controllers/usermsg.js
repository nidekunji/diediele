/**
 * 用户消息控制器
 * @author Jerry
 * @version 1.0.0
 */

const UserService = require('../services/UserService')

async function get(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        let messages = await UserService.getUserMessages(userinfo.uid, ctx.query.scene);
        ctx.state.data = {
            messages
        }
    } else {
        ctx.state.code = -1
    }
}
async function confirm(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        const {msgid} = ctx.request.body;
        await UserService.deleteUserMessage(userinfo.uid, msgid);
    } else {
        ctx.state.code = -1
    }
}
module.exports = {
    get,
    confirm
}