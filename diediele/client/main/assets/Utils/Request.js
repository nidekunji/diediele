module.exports = function({method = "GET", data = null, url, async = true, dataType = "JSON", success = null, fail = null, complete = null }) {
    var caller = this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 1) {
            if (typeof fail == "function") {
                fail.call(caller, new Error("网络连接失败"));
            }
        }
        if (xhr.readyState == 4) {
            if (typeof complete == "function") {
                complete.call(caller);
            }
            if (xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                if (dataType && dataType.toLowerCase() == "json") {
                    response = JSON.parse(response);
                }
                if (typeof success == "function") {
                    success.call(caller, response);
                }
            } else {
                if (typeof fail == "function") {
                    fail.call(caller, new Error(xhr.statusText));
                }
            }
        }
    };
    xhr.open(method, url, async);
    xhr.send(data);
}