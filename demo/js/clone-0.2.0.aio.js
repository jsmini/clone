/*!
 * clone 0.2.0 (https://github.com/jsmini/clone)
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

  // 保持引用关系
  var UNIQUE_KEY = 'com.yanhaijing.' + new Date().getTime();

  // 创建数据
  function createData() {
    return [];
  }
  // 将数据加入暂存区
  function setData(data, source, target) {
    var index = data.length;
    data[index] = { source: source, target: target };
    source[UNIQUE_KEY] = index;
  }
  // 查找缓存
  function findData(data, source) {
    var index = source[UNIQUE_KEY];

    if (typeof index === 'number') {
      return data[index].target;
    }

    return false;
  }
  // 清除缓存
  function clearData(data) {
    for (var i = 0; i < data.length; i++) {
      delete data[i].source[UNIQUE_KEY];
    }
    data.length = 0;
  }
  function cloneForce(x) {
    var uniqueData = createData();
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
      var source = node.data;
      var tt = type(source);

      // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
      var target = parent;
      if (typeof key !== 'undefined') {
        target = parent[key] = tt === 'array' ? [] : {};
      }

      // 复杂数据需要缓存操作
      if (isClone(source)) {
        // 命中缓存，直接返回缓存数据
        var uniqueTarget = findData(uniqueData, source);
        if (uniqueTarget) {
          parent[key] = uniqueTarget;
          continue; // 中断本次循环
        }

        // 未命中缓存，保存到缓存
        setData(uniqueData, source, target);
      }

      if (tt === 'array') {
        for (var i = 0; i < source.length; i++) {
          if (isClone(source[i])) {
            // 下一次循环
            loopList.push({
              parent: target,
              key: i,
              data: source[i],
            });
          } else {
            target[i] = source[i];
          }
        }
      } else if (tt === 'object') {
        for (var k in source) {
          if (hasOwnProp(source, k)) {
            if (k == UNIQUE_KEY) continue;
            if (isClone(source[k])) {
              // 下一次循环
              loopList.push({
                parent: target,
                key: k,
                data: source[k],
              });
            } else {
              target[k] = source[k];
            }
          }
        }
      }
    }

    clearData(uniqueData);

    return root;
  }

  exports.clone = clone;
  exports.cloneJSON = cloneJSON;
  exports.cloneLoop = cloneLoop;
  exports.cloneForce = cloneForce;

  Object.defineProperty(exports, '__esModule', { value: true });
});
