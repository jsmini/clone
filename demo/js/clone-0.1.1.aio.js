/*!
 * clone 0.1.1 (https://github.com/jsmini/clone)
 * API https://github.com/jsmini/clone/blob/master/doc/api.md
 * Copyright 2017-2018 jsmini. All Rights Reserved
 * Licensed under MIT (https://github.com/jsmini/clone/blob/master/LICENSE)
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : factory((global.jsmini_clone = {}));
})(this, function (exports) {
  'use strict';

  /*!
   * type 0.4.1 (https://github.com/jsmini/type)
   * API https://github.com/jsmini/type/blob/master/doc/api.md
   * Copyright 2017-2018 jsmini. All Rights Reserved
   * Licensed under MIT (https://github.com/jsmini/type/blob/master/LICENSE)
   */

  const toString = Object.prototype.toString;

  function type(x) {
    if (x === null) {
      return 'null';
    }

    const t = typeof x;

    if (t !== 'object') {
      return t;
    }

    let c;
    try {
      c = toString.call(x).slice(8, -1).toLowerCase();
    } catch (e) {
      return 'object';
    }

    if (c !== 'object') {
      return c;
    }

    if (x.constructor == Object) {
      return c;
    }

    try {
      // Object.create(null)
      if (Object.getPrototypeOf(x) === null || x.__proto__ === null) {
        return 'object';
      }

      return 'unknown';
    } catch (e) {
      // ie下无Object.getPrototypeOf
      return 'unknown';
    }
  }

  // Object.create(null) 的对象，没有hasOwnProperty方法
  function hasOwnProp(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  // 仅对对象和数组进行深拷贝，其他类型，直接返回
  function isClone(x) {
    var t = type(x);
    return t === 'object' || t === 'array';
  }

  // 递归
  function clone(x) {
    if (!isClone(x)) return x;

    var t = type(x);

    var res = void 0;

    if (t === 'array') {
      res = [];
      for (var i = 0; i < x.length; i++) {
        // 避免一层死循环 a.b = a
        res[i] = x[i] === x ? res : clone(x[i]);
      }
    } else if (t === 'object') {
      res = {};
      for (var key in x) {
        if (hasOwnProp(x, key)) {
          // 避免一层死循环 a.b = a
          res[key] = x[key] === x ? res : clone(x[key]);
        }
      }
    }

    return res;
  }

  // 通过JSON深拷贝
  function cloneJSON(x) {
    var errOrDef =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (!isClone(x)) return x;

    try {
      return JSON.parse(JSON.stringify(x));
    } catch (e) {
      if (errOrDef === true) {
        throw e;
      } else {
        console.error('cloneJSON error: ' + e.message);
        return errOrDef;
      }
    }
  }

  // 循环
  function cloneLoop(x) {
    var t = type(x);

    var root = x;

    if (t === 'array') {
      root = [];
    } else if (t === 'object') {
      root = {};
    }

    // 循环数组
    var loopList = [
      {
        parent: root,
        key: undefined,
        data: x,
      },
    ];

    while (loopList.length) {
      // 深度优先
      var node = loopList.pop();
      var parent = node.parent;
      var key = node.key;
      var data = node.data;
      var tt = type(data);

      // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
      var res = parent;
      if (typeof key !== 'undefined') {
        res = parent[key] = tt === 'array' ? [] : {};
      }

      if (tt === 'array') {
        for (var i = 0; i < data.length; i++) {
          // 避免一层死循环 a.b = a
          if (data[i] === data) {
            res[i] = res;
          } else if (isClone(data[i])) {
            // 下一次循环
            loopList.push({
              parent: res,
              key: i,
              data: data[i],
            });
          } else {
            res[i] = data[i];
          }
        }
      } else if (tt === 'object') {
        for (var k in data) {
          if (hasOwnProp(data, k)) {
            // 避免一层死循环 a.b = a
            if (data[k] === data) {
              res[k] = res;
            } else if (isClone(data[k])) {
              // 下一次循环
              loopList.push({
                parent: res,
                key: k,
                data: data[k],
              });
            } else {
              res[k] = data[k];
            }
          }
        }
      }
    }

    return root;
  }

  function find(arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].source === item) {
        return arr[i];
      }
    }

    return null;
  }
  // 保持引用关系
  function cloneForce(x) {
    var uniqueList = []; // 用来去重
    var t = type(x);

    var root = x;

    if (t === 'array') {
      root = [];
    } else if (t === 'object') {
      root = {};
    }

    // 循环数组
    var loopList = [
      {
        parent: root,
        key: undefined,
        data: x,
      },
    ];

    while (loopList.length) {
      // 深度优先
      var node = loopList.pop();
      var parent = node.parent;
      var key = node.key;
      var data = node.data;
      var tt = type(data);

      // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
      var res = parent;
      if (typeof key !== 'undefined') {
        res = parent[key] = tt === 'array' ? [] : {};
      }

      // 数据已经存在
      var uniqueData = find(uniqueList, data);
      if (uniqueData) {
        parent[key] = uniqueData.target;
        continue; // 中断本次循环
      }

      // 数据不存在
      // 保存源数据，在拷贝数据中对应的引用
      uniqueList.push({
        source: data,
        target: res,
      });

      if (tt === 'array') {
        for (var i = 0; i < data.length; i++) {
          if (isClone(data[i])) {
            // 下一次循环
            loopList.push({
              parent: res,
              key: i,
              data: data[i],
            });
          } else {
            res[i] = data[i];
          }
        }
      } else if (tt === 'object') {
        for (var k in data) {
          if (hasOwnProp(data, k)) {
            if (isClone(data[k])) {
              // 下一次循环
              loopList.push({
                parent: res,
                key: k,
                data: data[k],
              });
            } else {
              res[k] = data[k];
            }
          }
        }
      }
    }

    return root;
  }

  exports.clone = clone;
  exports.cloneJSON = cloneJSON;
  exports.cloneLoop = cloneLoop;
  exports.cloneForce = cloneForce;

  Object.defineProperty(exports, '__esModule', { value: true });
});
