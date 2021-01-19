const LotteryDrawService = require('../services/LotteryDrawService')

async function run(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        // 获取用户提交的数据
        let prizeID = await LotteryDrawService.run(ctx.state.$wxInfo.userinfo);
        ctx.state.data = {prizeID}
    } else {
        ctx.state.code = -1
    }
}
async function forceRun(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        // 获取用户提交的数据
        let prizeID = await LotteryDrawService.forceRun(ctx.state.$wxInfo.userinfo);
        ctx.state.data = {prizeID}
    } else {
        ctx.state.code = -1
    }
}
async function state(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        // 获取用户提交的数据
        let canRun = LotteryDrawService.canRun(ctx.state.$wxInfo.userinfo);
        let shareTimeRemain = LotteryDrawService.getShareTimeRemain(ctx.state.$wxInfo.userinfo);
        ctx.state.data = {canRun, shareTimeRemain}
    } else {
        ctx.state.code = -1
    }
}
async function share(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        // 获取用户提交的数据
        let shareTimeRemain = await LotteryDrawService.share(ctx.state.$wxInfo.userinfo);
        ctx.state.data = {shareTimeRemain}
    } else {
        ctx.state.code = -1
    }
}
module.exports = {
    run,
    forceRun,
    state,
    share
}