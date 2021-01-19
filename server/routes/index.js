/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 --- //
// 登录接口
router.post('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user/data', validationMiddleware, controllers.user.get)
router.post('/user/data', validationMiddleware, controllers.user.post)

// --- 用户消息 --- //
router.get('/user/message', validationMiddleware, controllers.usermsg.get)
router.post('/user/message/confirm', validationMiddleware, controllers.usermsg.confirm)

// --- 游戏 --- //
router.post('/game/start', validationMiddleware, controllers.game.start)
router.post('/game/success', validationMiddleware, controllers.game.success)
router.post('/game/fail', validationMiddleware, controllers.game.fail)
router.post('/game/skip', validationMiddleware, controllers.game.skip)
router.get('/game/shareToGroupPrize', validationMiddleware, controllers.game.shareToGroupPrize)

// --- 关卡 --- //
router.get('/level/code', controllers.level.code)

// --- 设置 --- //
router.get('/setting/all', controllers.setting.all)

// --- 主题 --- //
router.post('/theme/buy', validationMiddleware, controllers.theme.buy)

// --- 抽奖 --- //
router.get('/lotterydraw/state', validationMiddleware, controllers.lotterydraw.state)
router.get('/lotterydraw/run', validationMiddleware, controllers.lotterydraw.run)
router.get('/lotterydraw/forceRun', validationMiddleware, controllers.lotterydraw.forceRun)
router.get('/lotterydraw/share', validationMiddleware, controllers.lotterydraw.share)

// --- 礼包 --- //
router.get('/timedbag/canOpen', validationMiddleware, controllers.timedbag.canOpen)
router.get('/timedbag/open', validationMiddleware, controllers.timedbag.open)
router.get('/timedbag/forceOpen', validationMiddleware, controllers.timedbag.forceOpen)

// --- 排行榜 --- //
router.get('/rank/all', validationMiddleware, controllers.rank.all)
router.get('/rank/friend', validationMiddleware, controllers.rank.friend)

// --- 微信支付异步通知 --- //
router.post('/notify', controllers.notify)

// --- 微信平台相关接口 --- //
router.get('/wechat/acode', controllers.wechat.acode)
router.post('/wechat/decrypt', validationMiddleware, controllers.wechat.decrypt)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

module.exports = router
