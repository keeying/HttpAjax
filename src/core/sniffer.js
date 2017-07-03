var Sniffer = (function () {
  'use strict';
  // 用户代理
  var ua = window.navigator.userAgent;
  // 操作平台
  var pl = window.navigator.platform;

  // 引擎
  var engine = {
    ie: 0,
    gecko: 0,
    khtml: 0,
    opera: 0,
    // 具体版本号
    ver: null
  }

  // 浏览器
  var browser = {
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,
    // 具体版本
    ver: null
  };

  // 操作平台
  var system = {
    win: false,
    mac: false,
    xll: false,

    // 移动设备
    iphone: false,
    ipad: false,
    ipod: false,
    ios: false,
    android: false,
    nokiaN: false,
    winMobile: false,

    // 游戏设备
    wii: false,
    ps: false
  };

  // 识别opera，必须检测window.opera对象
  if (window.opera) {
    // 7.6版本后的opera通过version方法获取其版本号
    engine.ver = browser.ver = window.opera.version();
    client.engine = browser.engine = parseFloat(client.ver);
  }
  // 识别webkit内核
  else if (/AppleWebKit\/(\S+)/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.webkit = parseFloat(engine.ver);

    // 确定是Chrome浏览器 还是 Safari
    if (/Chrom\/(\S+)/.test(ua)) {
      browser.ver = RegExp['$1'];
      browser.chrome = parseFloat(browser.ver);
    } else if (/Version\/(\S+)/.test(ua)) {
      browser.ver = RegExp['$1'];
      browser.safari = parseFloat(browser.ver);
    } else {
      // 近似地确定版本
      var safariVersion = 1;
      if (engine.webkit < 100) {
        safariVersion = 1;
      } else if (engine.webkit < 312) {
        safariVersion = 1.2
      } else if (engine.webkit < 412) {
        safariVersion = 1.3
      } else {
        safariVersion = 2;
      }

      browser.safari = browser.ver = safariVersion;
    }
  }
  // 识别KHTML
  else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp['$1'];
    engine.khtml = browser.konq = parseFloat(engine.ver);
  }
  // 识别Gecko
  // 版本号会出现在用户代理字符串中的"rv:"后面
  else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.gecko = parseFloat(engine.ver);

    // 确定是不是 Firefox
    if (/Firefox\/(\S+)/.test(ua)) {
      browser.ver = RegExp['$1'];
      browser.firefox = parseFloat(browser.ver);
    }
  }
  // 识别IE，版本号在字符串"MSIE"后面，一个分号前面
  else if (/MSIE ([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp['$1'];
    engine.ie = browser.ie = parseFloat(engine.ver);
  }

  // 检测平台
  system.win = pl.indexOf('Win') > -1;
  system.mac = pl.indexOf('Mac') > -1;
  system.xll = pl.indexOf('Linux') === 0 || pl == 'xll';

  // 检测windows操作系统
  if (system.win) {
    if (/Win(?:dows)?([^do]){2}\s?(\d+\.\d+)?/.test(ua)) {
      if (RegExp['$1'] == 'NT') {
        switch (RegExp['$2']) {
          case '5.0':
            system.win = '2000';
            break;
          case '5.1':
            system.win = 'XP';
            break;
          case '6.0':
            system.win = 'Vista';
            break;
          case '6.1':
            system.win = '7';
            break;
          default:
            system.win = 'NT';
            break;
        }
      } else if (RegExp['$2'] == '9x') {
        system.win = 'ME';
      } else {
        system.win = RegExp['$1']
      }
    }
  }

  // 检测移动设备
  system.iphone = ua.indexOf('iphone') > -1;
  system.ipod = ua.indexOf('ipod') > -1;
  system.ipad = ua.indexOf('ipad') > -1;
  system.nokiaN = ua.indexOf('NokiaN') > -1;

  // winphone
  if (system.win == 'CE') {
    system.winMobile = system.win;
  } else if (system.win == 'Ph') {
    if (/Windows Phone OS (\d+\.\d+))/.test(ua)) {
      system.win = 'Phone';
      system.winMobile = parseFloat(RegExp['$1']);
    }
  }

  // 检测 IOS 版本
  if (system.mac && ua.indexOf('Mobile') > -1) {
    if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
      system.ios = parseFloat(RegExp['$1'].replace('_', '.'));
    } else {
      system.ios = 2;
    }
  }

  // 检测 Andriod 版本
  if (/Android (\d+\.\d+)/.test(ua)) {
    system.android = parseFloat(RegExp['$1']);
  }

  // 游戏系统
  system.wii = ua.indexOf('wii') > -1;
  system.ps = /playstation/.test(ua);

  return {
    engine: engine,
    browser: browser,
    system: system
  };

}());