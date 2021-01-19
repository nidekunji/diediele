const debug = require('debug')('services[LevelService]')
const knex = require('./knex')
const CustomError = require('../lib/CustomError')
const {ERRORS} = require('../constants')
const LEVEL_COUNT = 272

/**
 * 根据关卡获取关卡配置
 * @param {Number} level 
 * @param {Boolean} throwException 
 * @returns {Promise}
 */
function getLevelConfigByLevel(level, columnNames, throwException = false) {
    return knex("t_level_config").first(columnNames).where({level}).catch(error => {
        if (throwException) {
            throw new CustomError(ERRORS.DBERR.ERR_WHEN_QUERY_DB, error.message);
        }
    });
}

module.exports = {
    LEVEL_COUNT,
    getLevelConfigByLevel
}