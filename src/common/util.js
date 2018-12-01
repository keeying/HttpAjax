(function (global, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(global);
    });
  } else {
    factory(global);
  }
}(typeof window !== 'undefined' ? window : this, function (window) {
  'use strict';

  var RES_PAGE_URL_RP_ORIGIN = 'https://m.sco.io';
  // 首尾处的空白正则
  var LEADING_OR_TRAILING_BLANKS = /(^\s*)|(\s*$)/g;
  // 协议正则
  var PROTOCOL_REG = /^https?:/;
  // 消息分割符正则
  var MSG_SEPARATOR_REG = /\s*[：:]+\s*/;
  // 100的整数倍
  var INTEGER_MULTIPLE_100 = /^[1-9][0-9]*0{2}$/;
  // 手机号校验正则
  var TEL_REG = /^1[34578][0-9]{9}$/;
  // 密码校验正则
  var PASSWORD_REG = /^(?!([a-zA-Z]+|[0-9]+)$)[a-zA-Z0-9]{8,16}$/;
  // 验证码校验正则
  var CODE_REG = /^[0-9]{4,6}$/;
  // 邀请码校验正则
  var INVITE_CODE_REG = /^[a-zA-Z0-9]*$/;
  // 身份证(位数&字符校验)
  var ID_CARD = /^[0-9]{15}(?:[0-9]{2}[0-9Xx])?$/;
  // 身份证号正则18位，次序为省（3位）市（3位）年（4位）月（2位）日（2位）顺序码（4位），末尾校验位可能为X
  var ID_CARD_NUMBER_18 = /^([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{3})([0-9Xx])$/;
  // 身份证号正则15位，次序为省（3位）市（3位）年（2位）月（2位）日（2位）顺序码（3位），皆为数字
  var ID_CARD_NUMBER_15 = /^([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{3})$/;
  // 身份证号省份代码
  var PROVINCE_CODE = /^(?:11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65|71|81|82|91)$/;
  // 两位有效小数位数字校验正则
  var TWO_DECIMAL_PLACES = /^[1-9][0-9]*(?:.[0-9]{1,2})?$/;

  var util = {};

  /**
   * 替换后台返回资源域
   * @param {string} resUrl
   */
  util.replaceResUrlOrigin = function (resUrl) {
    return resUrl && resUrl.replace(/^https?:\/\/[^/]*\//, RES_PAGE_URL_RP_ORIGIN);
  };

  /**
   * 图片404显示默认图片
   */
  util.imgLoadFailed = function (img) {
    if (img) {
      img.src = BROKEN_IMAGE;
    }
  };

  /**
   * 用星号替换手机号码显示
   */
  util.replacePhoneNumberUseAsterisk = function (value) {
    return value && value.replace(/^([0-9]{3})[0-9]{4}([0-9]{4})$/, '$1****$2');
  };

  /**
   * 验证邀请码合法性
   * @param {string} inviteCode 邀请码
   * @return {Boolean} 邀请码格式合法返回true，否则返回false
   */
  util.checkInviteCode = function (inviteCode) {
    return INVITE_CODE_REG.test(inviteCode);
  };
  /**
   * 验证密码
   * @param {string} password 密码
   * @return {Boolean} 密码格式合法返回true，否则返回false
   */
  util.checkPassword = function (password) {
    return PASSWORD_REG.test(password);
  };

  /**
   * 检查数字是否是合法的具有两位有效小数位的数字
   * @param {Number} decimal 小数
   * @return {Boolean} 数字合法返回true，否则返回false
   */
  util.is2DecimalPlaces = function (decimal) {
    return TWO_DECIMAL_PLACES.test(decimal);
  };

  /**
   * 验证验证码
   * @param {string} code 验证码
   * @return {Boolean} 验证码格式合法返回true，否则返回false
   */
  util.checkLoginCode = function (code) {
    return CODE_REG.test(code);
  };

  /**
   * 验证手机号码
   * @return {Boolean} 手机格式合法返回true，否则返回false
   */
  util.checkTelphone = function (telphone) {
    return TEL_REG.test(telphone);
  };

  /**
   * 身份证号验证
   * @param {String} idNumber 身份证号
   * @return {Boolean} 身份证合法返回true，否则返回false
   */
  util.checkIDCardNumber = function (idNumber) {
    if (!ID_CARD.test(idNumber)) {
      return false;
    }
    var idArr = [];
    if (idNumber.length === 15) {
      /**
       * 如果是15位身份证号，则先转换为18位
       * 转化成4位生日年份  '88' -> '1988'
       * 计算添加最后一位校验位 ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
       */
      idArr = idNumber.match(ID_CARD_NUMBER_15);
      idArr = idArr.slice(1);
      idArr[3] = '19' + idArr[3];
      idArr.push(calculateTheCheckDigit(idArr.join('')));
    } else if (idNumber.length === 18) {
      idArr = idNumber
        .match(ID_CARD_NUMBER_18)
        .slice(1);
    }
    return checkID(idArr);
  };

  /**
   * 检验身份证合法性：
   *  @param {Array} idArr 根据身份证规则切分成的字符数组
   *      省    市    地区    年      月    日   顺序吗  校验位
   *    ["43", "14", "03", "1968", "11", "24", "361", "3"]
   */
  function checkID(idArr) {
    var CS,
      Y,
      M,
      D,
      birthday,
      age;
    // 省份信息不合法，返回false
    if (!PROVINCE_CODE.test(idArr[0])) {
      return false;
    }
    CS = idArr
      .join('')
      .slice(0, 17);
    // 校验位不匹配，返回false
    if (idArr[7] !== calculateTheCheckDigit(CS)) {
      return false;
    }
    Y = parseInt(idArr[3], 10);
    M = parseInt(idArr[4] - 1, 10);
    D = parseInt(idArr[5], 10);
    birthday = new Date(Y, M, D);
    // 出生日期是否合法
    if (birthday.getFullYear() !== Y || birthday.getMonth() !== M || birthday.getDate() !== D) {
      return false;
    }
    // 年龄小于0岁，或者大于120岁，妖精
    age = (new Date()).getFullYear() - birthday.getFullYear();
    if (0 > age || age > 120) {
      return false;
    }
    return true;
  }

  /**
   * 计算身份证的校验位
   * @param {string} id 身份证号
   * @return {string} 校验位字符
   */
  function calculateTheCheckDigit(id) {
    var W = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
      C = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],
      A = id.split(''),
      length = A.length,
      sum = 0,
      i = 0;
    for (; i < length; i++) {
      sum += parseInt(A[i], 10) * W[i];
    }
    // 返回校验位
    return C[sum % 11];
  }

  /**
   * 银行卡号验证
   */
  util.checkBankNumber = function (bNumber) {};

  /**
   * 去除 URL 协议
   */
  util.trimProtocol = function (url) {
    return url
      .replace(LEADING_OR_TRAILING_BLANKS, '')
      .replace(PROTOCOL_REG, '');
  };

  /**
   * @param {string} dateStr // "2016-12-12 17:27:12"
   * @param {string} format // YY年M月D日 H:m
   */
  util.formatDate = function (dateStr, format) {
    var dateReg =
      //  年         月         日          时         分         秒
      /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/,
      dArr = dateStr
      .match(dateReg)
      .slice(1),
      _tmp;
    // console.log(dArr);
    _tmp = format
      .replace(/YY/, dArr[0])
      .replace(/Y/, dArr[0].slice(2, 4))
      .replace(/M/, dArr[1])
      .replace(/D/, dArr[2])
      .replace(/H/, dArr[3])
      .replace(/h/, parseInt(dArr[3], 10) % 12)
      .replace(/m/, dArr[4])
      .replace(/s/, dArr[5]);

    return _tmp;
  };

  /**
   * 获取查询字段
   */
  util.getSearchField = function (field) {
    var searchStr = window.location.search,
      searchArr = searchStr && searchStr
      .substring(1)
      .split('&'),
      i = 0,
      length = searchArr.length,
      item;
    if (searchArr) {
      for (; i < length; i++) {
        item = searchArr[i].split('=');
        if (item[0] === field) {
          return decodeURIComponent(item[1]);
        }
      }
    }
    return null;
  };

  /**
   * 对象转化成JSON串
   */
  util.JSONStringify2 = function (object) {
    var jsonStr = '',
      key;

    if (window.JSON && typeof JSON.stringify === 'function') {
      jsonStr = JSON.stringify(object);
    } else {
      if ($.isPlainObject(object)) {
        jsonStr += '{';

        for (key in object) {
          jsonStr += '"' + key + '":"' + object[key] + '",';
        }

        jsonStr = jsonStr.replace(/,$/, '');
        jsonStr += '}';
      }
    }
    return jsonStr;
  };

  /**
   * 对象转化成JSON串
   */
  util.JSONStringify = function (object) {
    var jsonStr = '',
      key;

    if (window.JSON && typeof JSON.stringify === 'function') {
      jsonStr = JSON.stringify(object);
    } else {
      if ($.isPlainObject(object)) {
        jsonStr += '{';

        for (key in object) {
          jsonStr += '"' + key + '":"' + object[key] + '",';
        }

        jsonStr = jsonStr.replace(/,$/, '');
        jsonStr += '}';
      }
    }
    return encodeURIComponent(jsonStr);
  };

  /**
   * 解析 JSON 字符串
   */
  util.parseJSON = function (jsonStr) {
    JSON.parse(jsonStr);
  };

  /**
   * 解析消息数据
   */
  util.parseResponseMsg = function (msg) {
    var _msg = msg.split(MSG_SEPARATOR_REG);

    if (_msg.length > 1) {
      _msg[0] = '<span class="alert-msg-title">' + _msg[0] + '</span>';
    }
    return _msg.join('');
  };

  window.util = util;
}));
