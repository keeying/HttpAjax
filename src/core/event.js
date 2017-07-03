var EventUtil = (function () {
    'use strict';
    // UI
    // 确定浏览器是否支持DOM2级别的UI事件
    var isSupportedUIDOM2 = document.implementation.hasFeature('HTMLEvents', '2.0');
    // 确定浏览器是否支持DOM3级别的UI事件
    var isSupportedUIDOM3 = document.implementation.hasFeature('UIEvent', '3.0');
    // MOUSE
    //  检测浏览器是否支持DM2级鼠标事件
    var isSupportedMouseDOM2 = document.implementation.hasFeature('MouseEvents', '2.0');
    // 检测浏览器是否支持DM3级别鼠标事件
    var isSupportedMouseDOM3 = document.implementation.hasFeature('MouseEvent', '3.0');
    var EU = {};
    return EU;
}());