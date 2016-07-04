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

  // 不需要转化的html标签
  var ignoreTags = /^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i;

  // Dom 命名空间，所有有关DOM的操作都将绑定在此对象上。
  var ScorpionDOM = {};

  /**
   * DOM 元素转化，将非自关闭html元素标签转化成正常的html标签
   * @param html {String}  需要转化的html片段
   * @return html {String} 正常html标签
   */
  ScorpionDOM.convert = function (html) {
    return html.replace(/(<(\w+)[^>]*?)\/>/g, function (match, front, tag) {
      return ignoreTags.test(tag) ? match : front + '></' + tag + '>';
    });
  };

  /**
   * 创建 DOM 节点
   * @param html {String}
   * @param doc {Document}
   * @param fragment {DocumentFragment} 用于持有生成的 DOM 节点
   * return childNodes {NodeList}
   */
  ScorpionDOM.createNodes = function (htmlStr, doc, fragment) {

    /*
     * 1、<option>和<optgroup>需要包含在<select multiple="multiple">...</section>里；
     * 2、<lenged>需要包含在<fieldset>...</fieldset>里；
     * 3、<thead>、<tbody>、<tfoot>、<colgroup>以及<caption>>需要包含在<table>...</table>里；
     * 4、<tr>需要包含在<table><thead>...</thead></table>、<table><tbody>...</tbody></table>或者
     *    <table><tfoot>...</tfoot></table>里；
     * 5、<td>和<th>需要包含在<table><tbody><tr>...<tr></tbody></table>里；
     * 6、col必须包含在<table><tbody></tbody><colgroup>...</colgroup></table>里；
     * 7、<lin>和<script>需要包含在<div><div></div>...</div>里。
     *   
     * 由于：
     *   1、使用 multiple 特性的<select>元素（相对的是非多选下拉框），不会自动检测放在其中的选项
     *     （而单选下拉框会默认选中第一个选项）；
     *   2、<col>需要一个额外的<tbody>修复，如果没有的话<colgroup>无法正常生成；
     *   3、<link>和<script>的修复很怪异：IE 浏览器无法通过 innerHTML 生成<link>和<script>元素，
     *      除非他们包含在另一个节点中，并且还得又一个相邻节点。
     */
    var map = {
      '<td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      '<th': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      '<tr': [2, '<table><tbody>', '</tbody></table>'],
      '<option': [1, '<select multiple="multiple">', '</select>'],
      '<optgroup': [1, '<select multiple="multiple">', '</select>'],
      '<legend': [1, '<fieldset>', '</fieldset>'],
      '<thead': [1, '<table>', '</table>'],
      '<tbody': [1, '<table>', '</table>'],
      '<tfoot': [1, '<table>', '</table>'],
      '<colgroup': [1, '<table>', '</table>'],
      '<caption': [1, '<table>', '</table>'],
      '<col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
      '<link': [3, '<div></div><div>', '</div>']
    };

    // 使用正则表达式匹配开始尖括号和要注入的元素标签名称。
    var tagName = htmlStr.match(/<\w+/);

    // 如果匹配了映射中的内容，就获得该条目，
    var mapEntry = tagName ? map[tagName[0]] : null;
    // 否则，就构建一个深度为0的虚假空父标签。
    if (!mapEntry) {
      mapEntry = [0, '', '']
    }

    // 创建一个<div>元素，在里面创建新节点。注意：如果传入的文档存在的话就只用传入的文档，
    // 如果不存在就使用当前默认文档。
    var div = (doc || document).createElement('div');

    // 将要注入的新标签包装在来自映射的父元素中，
    // 然后将其作为新创建的<div>的 innerHTML 内容进行注入
    div.innerHTML = mapEntry[1] + htmlStr + mapEntry[2];

    // 遍历刚创建的 DOM 树，遍历深度为 map 条目里定义的值。最终的值应该是新元素的父元素。
    while (mapEntry[0]--) {
      div = div.lastChild;
    }

    // 如果传入了一个 fragment 片段，则让其持有生成的 DOM 节点
    if (fragment) {
      while (div.firstChild) {
        fragment.appendChild(div.firstChild);
      }
    }

    // 返回新创建的元素
    return div.childNodes;

  };

  /**
   * 插入 DOM 节点
   * @param eles {NodeList} 目标集合
   * @param args {String}
   * @param callback {function}
   */
  
  ScorpionDOM.insert = function (eles, args, callback) {
    // <tr>元素需要添加到<tbody>里。
    function root(elem, cur) {
      return elem.nodeName.toLowerCase() === 'table' && cur.nodeName.toLowerCase() === 'tr' ?
        (elem.getElementsByTagName('tbody')[0] || elem.appendChild(elem.ownerDocument.createElement('tbody'))) : elem;
    }

    var length = eles.length;

    if (length) {
      // 获取当前DOM元素所在的文档
      var doc = eles[0].ownerDocument || eles[0],
        // 创建文档片段用于暂存生成的DOM节点
        fragment = doc.createDocumentFragment(),
        // 生成节点
        scripts = ScorpionDOM.createNodes(args, doc, fragment),
        first = fragment.firstChild;

      // 将DOM节点循环加入到指定的位置
      if (first) {
        for (var i = 0; eles[i]; i++) {
          callback.call(root(eles[i], first),
            // 如果需要加入多个位置则，复制文档碎片
            length > 1 ? fragment.cloneNode(true) : fragment);
        }
      }
    }
  }

  window.ScorpionDOM = ScorpionDOM;

  return ScorpionDOM;
}));