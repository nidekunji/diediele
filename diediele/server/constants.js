module.exports = {
    /**
     * 错误定义
     */
    ERRORS: {
        ERR_IN_DECRYPT_DATA: "ERR_IN_DECRYPT_DATA",
        /**
         * 数据库错误
         */
        DBERR: {
            /**
             * 更新记录失败
             */
            ERR_WHEN_UPDATE_TO_DB: 'ERR_WHEN_UPDATE_TO_DB',
            /**
             * 插入记录失败
             */
            ERR_WHEN_INSERT_TO_DB: 'ERR_WHEN_INSERT_TO_DB',
            /**
             * 删除记录失败
             */
            ERR_WHEN_DELETE_FROM_DB: 'ERR_WHEN_DELETE_FROM_DB',
            /**
             * 查询出错
             */
            ERR_WHEN_QUERY_DB: 'ERR_WHEN_QUERY_DB',
            /**
             * 事务执行失败
             */
            ERR_WHEN_EXEC_TRANSACTION: 'ERR_WHEN_EXEC_TRANSACTION'
        },
        /**
         * 请求错误
         */
        REQERR: {
            /**
             * 认证失败
             */
            ERR_AUTH: -1,
            /**
             * 未知错误
             */
            ERR_UNKNOWN_TYPE: 'ERR_UNKNOWN_TYPE',
            /**
             * 订单号错误
             */
            ERR_ORDER_ID: 'ERR_ORDER_ID'
        },
        /**
         * 服务错误
         */
        SERVICEERR: {
            /**
             * 订单创建失败
             */
            ERR_WHEN_CREATE_ORDER: 'ERR_WHEN_CREATE_ORDER',
            /**
             * 用户ID错误
             */
            ERR_UID: 'ERR_UID',
            /**
             * 错误用户
             */
            ERR_USER: 'ERR_USER',
            /**
             * 关卡有误
             */
            ERR_LEVEL: 'ERR_LEVEL',
            /**
             * 金币不足
             */
            ERR_LACK_OF_GOLDCOIN: 'ERR_LACK_OF_GOLDCOIN',
            /**
             * 爱心不足
             */
            ERR_LACK_OF_LOVE: 'ERR_LACK_OF_LOVE',
            /**
             * 用户主题已存在
             */
            ERR_USER_THEME_EXISTS: 'ERR_USER_THEME_EXISTS',
            /**
             * 主题不存在
             */
            ERR_THEME_NOT_FOUND: 'ERR_THEME_NOT_FOUND',
            /**
             * 不允许进行抽奖
             */
            ERR_LOTTERY_DRAW_NOT_ALLOWED: 'ERR_LOTTERY_DRAW_NOT_ALLOWED'
        },
        DATAERR: {
            ERR_UNKNOWN_PAYTYPE: 'ERR_UNKNOWN_PAYTYPE'
        },
        /**
         * AccessToken获取失败
         */
        ERR_FETCH_ACCESS_TOKEN: 'ERR_FETCH_ACCESS_TOKEN'
    },
    /**
     * 用户消息类型
     */
    USER_MESSAGE_TYPE: {
        /**
         * 好友帮助成功
         */
        FRIEND_HELP_SUCCESS: 1
    },
    /**
     * 客户端场景
     */
    SCENES: {
        /**
         * 全部
         */
        ALL: 0,
        /**
         * 首页
         */
        HOME: 1,
        /**
         * 游戏界面
         */
        MAIN: 2
    },
    /**
     * 道具类型
     */
    PROP_TYPE: {
        /**
         * 金币
         */
        GOLD_COIN: 1,
        /**
         * 爱心
         */
        LOVE: 2,
        /**
         * 主题|皮肤
         */
        THEME: 3
    },
    /**
     * 付款类型
     */
    PAY_TYPE: {
        /**
         * 金币道具
         */
        GOLD_COIN: 101,
        /**
         * 爱心道具
         */
        LOVE: 102,
        /**
         * 人民币
         */
        RMB: 201
    },
    USER_THEME_BUY_RECORD_STATUS: {
        WAIT_PAY: 0,
        PAYED: 1,
        EXPIRED: 2,
        CANCELD: 3
    }
}
