const LevelService = require('../services/LevelService')
const PrizeService = require('../services/PrizeService')
const ThemeService = require('../services/ThemeService')

async function all(ctx, next) {
    const loginPrizes = PrizeService.getLoginPrizes();
    const sharePrizes = PrizeService.getSharePrizes();
    const lotteryDrawPrizes = PrizeService.getLotteryDrawPrizes();
    const themes = ThemeService.getThemes();
    ctx.state.data = {
        levelCount: LevelService.LEVEL_COUNT,
        loginPrizes,
        sharePrizes,
        lotteryDrawPrizes,
        themes
    }
}
module.exports = {
    all
}