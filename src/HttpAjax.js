(function (global, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(global);
    });
  } else {
    factory(global);
  }
} (typeof window !== 'undefined' ? window : this, function (window) {
  'use strict';
  /**
   * HttpAjax 构造函数
   */
  var HttpAjax = function () { };
  
  //空函数，作为默认回调函数
  var empty = function () { };

  /**
   * 使用惰性函数创建xhr对象
   */
  var createXHR = function () {
    var xhr;
    if (typeof XMLHttpRequest !== 'undefined') {
      xhr = new XMLHttpRequest();
      createXHR = function () {
        return new XMLHttpRequest();
      }
    } else {
      try {
        xhr = new ActiveXObject('Msxml2.XMLHTTP');
        createXHR = function () {
          return new ActiveXObject('Msxml2.XMLHTTP');
        }
      } catch (error) {
        try {
          xhr = new ActiveXObject('Microsoft.XMLHTTP');
          createXHR = function () {
            return new ActiveXObject('Microsoft.XMLHTTP');
          }
        } catch (error) {
          return null;
        }
      }
    }
    return xhr;
  }

  window.HttpAjax = HttpAjax;
  return HttpAjax;
}));