const RankService = require('../services/RankService')

/**
 * 获取世界排行榜
 * @param {*} ctx 
 * @param {*} next 
 */
async function all(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        const rank = await RankService.getRankAll(parseInt(ctx.query.type));
        const {myRank, myCount} = await RankService.getMyRankAll(ctx.state.$wxInfo.userinfo, parseInt(ctx.query.type));
        ctx.state.data = {rank, myRank, myCount};
    } else {
        ctx.state.code = -1
    }
}
/**
 * 获取好友排行榜
 * @param {Object} ctx 
 * @param {Function} next 
 */
async function friend(ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        const rank = await RankService.getRankFriend(ctx.state.$wxInfo.userinfo.uid, parseInt(ctx.query.type));
        const {myRank, myCount} = await RankService.getMyRankFriend(ctx.state.$wxInfo.userinfo, parseInt(ctx.query.type));
        ctx.state.data = {rank, myRank, myCount};
    } else {
        ctx.state.code = -1
    }
}
module.exports = {
    all,
    friend
}
