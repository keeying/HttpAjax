var HttpAjax = (function () {
    // 公用空函数
    var empty = function () { };
    var createXHR = function () {
        var xhr;
        if (typeof XMLHttpRequest !== 'undefined') {
            xhr = new XMLHttpRequest();
            createXHR = function () {
                return new XMLHttpRequest();
            };
        } else {
            try {
                xhr = new ActiveXObject('Msxml2.XMLHTTP');
                createXHR = function () {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                };
            } catch (error) {
                try {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                    createXHR = function () {
                        return new ActiveXObject('Microsoft.XMLHTTP');
                    };
                } catch (error) {
                    return null;
                }
            }
        }
        return xhr;
    }
});