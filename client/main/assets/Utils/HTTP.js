var crypto = require("crypto");
//var URL = "https://moneygame.dianjinyouxi.com/test/api/";//手机
var URL = "https://ddl.dianjinyouxi.com/weapp/";//本地
//var URL = "https://moneygame.dianjinyouxi.com/api/";//正式服
// console.log('HTTP Server', URL);
var MaxRetryTimes = 3,
    RetryTimes = 3;
cc.Class({
    extends: cc.Component,
    statics: {
        sendRequest: function (api, reqType, params, callback, retryTimes) {
          //  console.log(reqType, params, 'api, reqType, params');
            if (retryTimes) RetryTimes = retryTimes
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 0) {
                        if (RetryTimes == 0) {
                            RetryTimes = MaxRetryTimes;
                            cc.log("网络连接失败");
                            if (callback) callback({
                                code: 10000
                            });
                        } else {
                            RetryTimes = RetryTimes - 1
                            self.sendRequest(api, params, callback, RetryTimes);
                        }
                    };

                    if (xhr.status >= 200 && xhr.status < 300) {
                        var response = xhr.responseText;
                        var data = JSON.parse(response);
                        if (callback) callback(data);
                    };

                    if (xhr.status >= 400 && xhr.status < 500) {
                        if (callback) callback({
                            code: xhr.status + 8000
                        });
                    };

                    if (xhr.status >= 500) {
                        cc.log("Server API_ERR");
                        if (callback) callback({
                            code: xhr.status + 8000
                        });
                    };

                }
            };


            
      
            xhr.open(reqType, URL.concat(api), true);
            xhr.setRequestHeader("Content-type", "application/json");
            if (params.code) {
                xhr.setRequestHeader("x-wx-code", params.code);
            }
            if (window.session) {
                xhr.setRequestHeader("x-wx-skey", window.session);
            }
            
          //  xhr.setRequestHeader("Authorization", Global.token);
          // cc.log("==http=url==",URL+ "?api="  + JSON.stringify(params));
            xhr.send(JSON.stringify(params));
        },
    },
});