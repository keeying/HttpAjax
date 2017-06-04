(function ($) {
  /**
   * @description 弹窗组件
   * @argument title:@string 弹窗标题
   * @argument  msg:@string 消息
   * @argument buttons:@Array 按钮数组
   *          {text: '', onPress: ()=>{}}
   * @argument cancelable:@boolean true: 开启点击弹窗周围区域隐藏弹窗 
   *                               false: 否则不开启
   */
  var Alert = function (title, msg, buttons, cancelable) {
    var _self = this;
    this.title = title || '系统提示';
    this.msg = msg;
    this.buttons = buttons || [{
      text: '确定',
      onPress: function () {
        _self.hide();
      }
    }];
    this.cancelable = !!cancelable;
    this.init();
  }

  Alert.prototype.init = function () {
    var _self = this;
    var _buttons = [];
    this.$alert = $('<div class="alert-container"><div class="alert-wrapper">' + (this.title ? '<div class="alert-header">' + this.title + '</div>' : '') + '<div class="alert-content">' + (this.msg || '') + '</div><div class="alert-footer"></div></div></div>');
    var size = this.buttons.length < 4 ? this.buttons.length : 3;
    $.each(this.buttons, function (idx, button) {
      // 最多支持3个按钮
      if (idx > 2) return;
      var $btn = $('<button class="alert-btn btn-column-' + size + '">' + button.text + '</button>');
      $btn.one('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        button.onPress.call(_self);
      });
      _buttons[idx] = $btn;
    });
    if (this.cancelable) {
      this.$alert.one('click', function (e) {
        e.stopPropagation();
        _self.hide();
      });
      this.$alert.find('.alert-wrapper').one('click', function (e) {
        e.stopPropagation();
      });
    }
    this.$alert.find('.alert-footer').append(_buttons);
    $('body').append(this.$alert);
    this.$alert[0].addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
    this.show();
  };

  Alert.prototype.show = function () {
    var $C = this.$alert.find('.alert-wrapper');
    var _$alert = this.$alert;
    // console.log($C[0].getBoundingClientRect());
    _$alert.fadeIn(260);
    $C.css({
      display: 'block',
      width: $C.width() + 20,
      height: $C.height() + 20,
      top: (_$alert.height() - $C.height() - 20) / 2
    }).animate({
      opacity: 1,
      width: '-=20',
      height: '-=20',
      top: '-=10'
    }, 160);
    // console.log((_$alert.height() - $C.height()) / 2);
    // console.log($C[0].getBoundingClientRect());
  };

  Alert.prototype.hide = function () {
    var _self = this;
    this.$alert.fadeOut(360, function () {
      _self.destory();
    });
  };

  Alert.prototype.immediatelyHide = function () {
    this.destory();
  };

  Alert.alert = function (title, msg, buttons, cancelable) {
    new Alert(title, msg, buttons, cancelable);
  }

  // 销毁弹窗
  Alert.prototype.destory = function () {
    this.$alert.remove();
  }
}(jQuery));