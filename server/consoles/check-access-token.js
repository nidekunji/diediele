const WechatService = require('../services/WechatService')

WechatService.checkAccessToken().then(function(){
    console.log('检查完成!');
    process.exit();
}).catch(e => {
    console.error('检查出错', e);
    process.exit();
});