(function () {
  'use strict';

  /**
   * @description
   * @argument cancelable 是否可关闭指示器
   */
  var ActivityIndicator = function (type, text, cancelable) {
    this.cancelable = !!cancelable;
    this.init(type, text, cancelable);
  };

  ActivityIndicator.prototype.init = function (type, text) {
    type = type ? type : 0;
    var _self = this;
    var spinners = ['<div class="spinner-02"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div><div class="spinner-text">' + (text || '处理中...') + '</div>', '<div class="spinner-01"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div><div class="spinner-text">' + (text || '处理中...') + '</div>', '<div class="spinner-03"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div><div class="spinner-text">' + (text || '处理中...') + '</div>'];
    this.$ai = $('<div class="indicator-container"><div class="indicator-wrapper">' + spinners[type] + '</div></div>');

    $('body').append(this.$ai);

    if (this.cancelable) {
      this.$ai.one('click', function () {
        _self.hide();
      });
      this.$ai.find('.indicator-wrapper').one('click', function (e) {
        e.stopPropagation();
      });
    }

    this.$ai[0].addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
    this.show();
  };

  ActivityIndicator.prototype.show = function () {
    this.$ai.fadeIn(260);
    this.$ai.find('.indicator-wrapper').fadeIn(0).animate({
      opacity: 1,
      width: 120,
      height: 120
    }, 240);
  };

  ActivityIndicator.prototype.hide = function () {
    var _self = this;
    this.$ai.fadeOut(260, function () {
      _self.destory();
    });
  };

  ActivityIndicator.prototype.immediatelyHide = function () {
    this.destory();
  };

  ActivityIndicator.prototype.destory = function () {
    this.$ai.remove();
  };

  ActivityIndicator.indicator = function (type, text, cancelable) {
    return new ActivityIndicator(type, text, cancelable);
  }
}(jQuery));