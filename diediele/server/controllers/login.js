/**
 * 登录控制器
 * @author Jerry
 * @version 1.0.0
 */

const PrizeService = require('../services/PrizeService')
// 登录授权接口
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState) {
        const userinfo = ctx.state.$wxInfo.userinfo;
        let loginPrizes = [];
        let registerPrizes = [];
        // 是否今日首次登录
        let isFirstLoginToday = false;
        // 当前日期
        let currentDate = new Date();
        // 最后一次登录日期
        let lastLoginDate = userinfo.last_visit_time ? new Date(userinfo.last_visit_time) : new Date();
        if (!userinfo.last_visit_time) {
            isFirstLoginToday = true;
            // 新注册用户
            // 获取新注册用户奖励
            registerPrizes = PrizeService.getRegisterPrizes();
        } else if (currentDate.getFullYear() > lastLoginDate.getFullYear()) {
            isFirstLoginToday = true;
        } else if (currentDate.getMonth() > lastLoginDate.getMonth()){
            isFirstLoginToday = true;
        } else if (currentDate.getDate() > lastLoginDate.getDate()) {
            isFirstLoginToday = true;
        }
        // 判断是否为今日首次登录
        if (isFirstLoginToday) {
            // 获取登录奖励
            loginPrizes = PrizeService.getLoginPrizesByDay(currentDate.getDay());
        }
        // 发放所有的奖励
        await PrizeService.sendPrizes(userinfo, ...registerPrizes, ...loginPrizes);
        ctx.state.data = {
            skey: ctx.state.$wxInfo.skey,
            userinfo: Object.assign({
                uid: 0,
                nickname: "",
                avatar_url: "",
                gender: 1,
                country: "",
                city: "",
                province: "",
                language: "zh_CN",
                level: 0,
                paragraph_level: 0,
                themes: "",
                goldcoin: 0,
                love: 0
            }, userinfo),
            registerPrizes: registerPrizes,
            loginPrizes: loginPrizes,
            time: Math.floor(Date.now() / 1000),
            day: currentDate.getDay()
        }
    } else {
        ctx.state.code = -1
    }
}
