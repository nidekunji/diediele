const UserService = require('../services/UserService')

/**
 * 获取用户信息
 * @param {*} ctx 
 * @param {*} next 
 */
async function get(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const userinfo = ctx.state.$wxInfo.userinfo;
        ctx.state.data = {
            uid: userinfo.uid,
            nickname: userinfo.nickname,
            avatar_url: userinfo.avatar_url,
            gender: userinfo.gender,
            country: userinfo.country,
            city: userinfo.city,
            province: userinfo.province,
            language: userinfo.language,
            level: userinfo.level,
            paragraph_level: userinfo.paragraph_level,
            goldcoin: userinfo.goldcoin,
            love: userinfo.love,
            last_visit_time: userinfo.last_visit_time,
            create_time: userinfo.create_time
        }
    } else {
        ctx.state.code = -1
    }
}
/**
 * 提交用户信息
 * @param {Object} ctx 
 * @param {Function} next 
 */
async function post(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        // 获取用户提交的数据
        const {avatar_url, city, country, gender, inviter_id, language, nickname, province} = ctx.request.body
        // 保存用户信息
        await UserService.saveUserInfo(ctx.state.$wxInfo.userinfo.uid, {avatar_url, city, country, gender, language, nickname, province})
        // 保存用户关系
        if (inviter_id) {
            await UserService.saveUserRelation(ctx.state.$wxInfo.userinfo.uid, inviter_id)
        }
    } else {
        ctx.state.code = -1
    }
}
module.exports = {
    get,
    post
}
