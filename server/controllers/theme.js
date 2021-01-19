const ThemeService = require('../services/ThemeService')

/**
 * 购买主题
 * @param {*} ctx 
 * @param {*} next 
 */
async function buy(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        const {theme_id} = ctx.request.body;
        let result = await ThemeService.buy(userinfo, theme_id, ctx);
        ctx.state.data = result;
    } else {
        ctx.state.code = -1
    }
}
module.exports = {
    buy
}