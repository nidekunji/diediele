module.exports = {
    /**
     * 错误定义
     */
    ERRORS: {
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
            ERR_LACK_OF_LOVE: 'ERR_LACK_OF_LOVE'
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
     * 发布平台
     */
    PLATFORM: {
        /**
         * 模拟器
         */
        SIMULATOR: 0,
        /**
         * 微信小游戏
         */
        WECHAT_GAME: 1,
        /**
         * QQ玩一玩
         */
        QQ_PLAY: 2
    },
    /**
     * 启动模式
     */
    BOOT_MODE: {
        /**
         * 工具
         */
        TOOL: 0,
        /**
         * 游戏
         */
        GAME: 1
    },
    /**
     * 游戏状态
     */
    GAME_STATE: {
        /**
         * 暂停等待
         */
        WAIT: 0,
        /**
         * 进行中
         */
        ING: 1,
        /**
         * 成功
         */
        SUCCESS: 2,
        /**
         * 失败
         */
        FAIL: 3
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
    /**
     * 游戏事件
     */
    GAME_EVENTS: {
        LEVEL_PAGES_LOADED: "level pages loaded",
        GAME_OVER: "game over",
        GAME_PASS: "game pass"
    },
    /**
     * 新手指引事件
     */
    GUIDE_EVENTS: {
        /**
         * 开始新手指引
         */
        BEGIN: "guide begin",
        /**
         * 开始某一步
         */
        STEP_BEGIN: "guide step begin",
        /**
         * 结束某一步
         */
        STEP_END: "guide step end",
        /**
         * 某一步出错
         */
        STEP_ERROR: "guide step error",
        /**
         * 新手指引结束
         */
        END: "guide end"
    },
    /**
     * 新手指引步骤
     */
    GUIDE_STEPS: {
        /**
         * 欢迎
         */
        WELCOME: "welcome",
        /**
         * 登录奖励提示
         */
        LOGIN_PRIZE_TIP: "login prize tip",
        /**
         * 登录奖励领取框
         */
        LOGIN_PRIZE_MODAL: "login prize modal",
        /**
         * 抽抽乐和限时礼包提示
         */
        LOTTERY_DRAW_AND_TIMEBAG_TIP: "lottery draw and timedbag tip",
        /**
         * 抽抽乐 - 点击入口按钮
         */
        LOTTERY_DRAW_TOUCH: "lottery draw touch",
        /**
         * 抽抽乐 - 点击开始按钮
         */
        LOTTERY_DRAW_RUN: "lottery draw run",
        /**
         * 抽抽乐 - 奖励提示
         */
        LOTTERY_DRAW_PRIZE: "lottery draw prize",
        /**
         * 抽抽乐 - 关闭提示
         */
        LOTTERY_DRAW_CLOSE: "lottery draw close",
        /**
         * 限时礼包 - 点击按钮
         */
        TIMEDBAG_TOUCH: "timedbag touch",
        /**
         * 限时礼包 - 奖励提示
         */
        TIMEDBAG_PRIZE: "timedbag prize",
        /**
         * 点击开始游戏按钮
         */
        START_GAME_TOUCH: "start game touch",
        /**
         * 点击按钮选择关卡
         */
        CHOOSE_LEVEL_TOUCH: "choose level touch",
        /**
         * 游戏界面基本介绍
         */
        GAME_BASE_DESCRIPTION: "game base description",
        /**
         * 游戏第1步
         */
        GAME_PLAY_STEP_1: "game play step 1",
        GAME_PLAY_STEP_2: "game play step 2",
        GAME_PLAY_STEP_3: "game play step 3",
        GAME_PLAY_STEP_4: "game play step 4",
        GAME_PLAY_STEP_5: "game play step 5",
        GAME_PLAY_STEP_6: "game play step 6",
        GAME_PLAY_STEP_7: "game play step 7",
        GAME_PLAY_STEP_8: "game play step 8",
        GAME_PLAY_STEP_9: "game play step 9",
        GAME_PLAY_STEP_10: "game play step 10"
    }
}
