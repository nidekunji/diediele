const LevelService = require('../services/LevelService')

async function code(ctx, next) {
    const {lvlcode} = await LevelService.getLevelConfigByLevel(parseInt(ctx.query.lvl), 'lvlcode', true);
    ctx.state.data = lvlcode;
}
module.exports = {
    code
}