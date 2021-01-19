const TimedBagService = require('../services/TimedBagService')

async function open(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        // 获取用户提交的数据
        let {prize, timeLeft} = await TimedBagService.open(ctx.state.$wxInfo.userinfo);
        ctx.state.data = {prize, timeLeft}
    } else {
        ctx.state.code = -1
    }
}
async function forceOpen(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        // 获取用户提交的数据
        let prize = await TimedBagService.forceOpen(ctx.state.$wxInfo.userinfo);
        ctx.state.data = {prize}
    } else {
        ctx.state.code = -1
    }
}
async function canOpen(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        // 获取用户提交的数据
        let {canOpenFlag: canOpen, timeLeft} = TimedBagService.canOpen(ctx.state.$wxInfo.userinfo);
        ctx.state.data = {canOpen, timeLeft, frequency: TimedBagService.FREQUENCY}
    } else {
        ctx.state.code = -1
    }
}
module.exports = {
    open,
    forceOpen,
    canOpen
}