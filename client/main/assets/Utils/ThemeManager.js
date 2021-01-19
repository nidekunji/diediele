/**
 * @author kunji
 * @description 主题管理
 * @time 2020.5.28
 */
const Theme = require('./Theme')

cc.Class({
    extends: cc.Object,

    properties: {
        
        rootPath: {
            default: '',
           // type: cc.String
        },
        preloadResList: {
            get () {
                return [];
            }
        },
        preloadResDirList: {
            get () {
                return [];
            }
        },
        defaultThemeID: {
            get () {
                return 'default';
            }
        },
        currentThemeID: {
            default: 'default',
          //  type: cc.String
        },
        currentTheme: {
            default: {},
            type: cc.Object
        },
        storageKey: {
            get () {
                return "window.theme.id";
            }
        },
        allThemes: {
            get () {
                return this._allThemes;
            },
            set (value) {
                this._allThemes = value;
            }
        }
    },

    init(themes) {
        this.allThemes = {};
        if (Array.isArray(themes) && themes.length > 0) {
            themes.forEach(theme => {
                this.allThemes[theme.id] = new Theme(theme);
            });
            // 设置当前主题
            var themeID = window.platform.getStorageSync(this.storageKey);
            if (themeID && (typeof this.allThemes[themeID] !== "undefined")) {
                this.currentThemeID = themeID;
                this.currentTheme = this.allThemes[themeID];
            } else {
                this.currentThemeID = this.defaultThemeID;
                this.currentTheme = this.allThemes[this.defaultThemeID];
            }
        } else {
            this.currentThemeID = this.defaultThemeID;
            this.currentTheme = new Theme(this.defaultThemeID);
        }
        // 设置当前主题根目录
        this.setCurrentThemeBasepath();
        // 资源预加载
        this.preloadResList.forEach(path => {
            this.preloadRes(path);
        });
        this.preloadResDirList.forEach(path => {
            this.preloadResDir(path);
        });
    },
    getTheme(themeID) {
        if (!themeID || themeID == this.currentThemeID) {
            return this.currentTheme;
        } else {
            return this.allThemes[themeID];
        }
    },
    setTheme(themeID) {
        if (themeID != this.currentThemeID) {
            this.currentThemeID = themeID;
            this.currentTheme = this.allThemes[themeID];
            this.setCurrentThemeBasepath();
            window.platform.setStorageSync(this.storageKey, themeID);
        }
    },
    setCurrentThemeBasepath() {
        this.currentTheme.basepath = this.rootPath + "themes/" + this.currentTheme.id + "/";
    },
    getAllThemes() {
        return this.allThemes;
    },
    downloadTheme(themeID) {

    },
    preloadRes(resPath) {

    },
    preloadResDir(resDirPath) {

    },
    /**
     * 
     * @param {*} path 
     * @returns {Promise<Object>} Resource
     */
    loadRes(path) {
        return this.currentTheme.loadRes(path);
    },
    loadResDir(dirpath) {
        return this.currentTheme.loadResDir(dirpath);
    },
    releaseRes(path) {
        this.currentTheme.releaseRes(path);
    },
    releaseResDir(dirpath) {
        this.currentTheme.releaseResDir(dirpath);
    }
});
