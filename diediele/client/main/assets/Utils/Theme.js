
cc.Class({
    extends: Object,

    properties: {
        basepath: {
            get () {
                return this._basepath;
            },
            set (value) {
                this._basepath = value;
            }
        },
        id: {
            get () {
                return this._themeID;
            },
            set (value) {
                this._themeID = value;
            }
        },
        name: {
            get () {
                return this._name;
            },
            set (value) {
                this._name = value;
            }
        },
        thumb: {
            get () {
                return this._thumb;
            },
            set (value) {
                this._thumb = value;
            }
        },
        paytype: {
            get () {
                return this._paytype;
            },
            set (value) {
                this._paytype = value;
            }
        },
        total: {
            get () {
                return this._total;
            },
            set (value) {
                this._total = value;
            }
        }
    },

    ctor({id, name, thumb, paytype, total}) {
        this.id = id;
        this.name = name;
        this.thumb = thumb;
        this.paytype = paytype;
        this.total = total;
    },

    /**
     * 
     * @param {*} path 
     * @returns {Promise<Object>} Resource
     */
    loadRes(path) {
        path = this.basepath + path;
        return new Promise(function(resolve, reject) {
            cc.loader.loadRes(path, function(error, resource) {
                if (error) {
                    cc.error("error when loadRes `" + path + "`", error);
                    reject(error);
                } else {
                    resolve(resource);
                }
            });
        });
    },
    loadResDir(dirpath) {
        dirpath = this.basepath + dirpath;
        return new Promise(function(resolve, reject) {
            cc.loader.loadResDir(dirpath, function(error, resources) {
                if (error) {
                    cc.error("error when loadResDir `" + dirpath + "`", error);
                    reject(error);
                } else {
                    resolve(resources);
                }
            });
        });
    },
    releaseRes(path) {
        path = this.basepath + path;
        cc.loader.releaseRes(path);
    },
    releaseResDir(dirpath) {
        dirpath = this.basepath + dirpath;
        cc.loader.releaseResDir(dirpath);
    }
});
