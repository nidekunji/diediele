const GameService = require('../services/GameService')

async function fail(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        const {level, help_seeker_id} = ctx.request.body;
        GameService.fail(userinfo, level);
    } else {
        ctx.state.code = -1
    }
}
async function success(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        const {level, help_seeker_id} = ctx.request.body;
        const result = await GameService.success(userinfo, level, help_seeker_id == "undefined" ? undefined : help_seeker_id);
        ctx.state.data = result;
    } else {
        ctx.state.code = -1
    }
}
async function start(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        const {level, help_seeker_id} = ctx.request.body;
        const consumes = await GameService.start(userinfo, parseInt(level), help_seeker_id == "undefined" ? undefined : parseInt(help_seeker_id));
        ctx.state.data = {consumes}
    } else {
        ctx.state.code = -1
    }
}

async function skip(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        const {level} = ctx.request.body;
        let newLevel = await GameService.skip(userinfo, parseInt(level));
        ctx.state.data = {newLevel}
    } else {
        ctx.state.code = -1
    }
}

async function shareToGroupPrize(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        let prizes = await GameService.shareToGroupPrize(userinfo);
        ctx.state.data = {prizes}
    } else {
        ctx.state.code = -1
    }
}

module.exports = {
    start,
    success,
    fail,
    skip,
    shareToGroupPrize
}