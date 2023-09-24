# 变更日志

## 0.5.0 / 2023-9-24

- 升级最新版 jslib-base
- 支持 Node.js ESM
- 升级 @jsmini/type

## 0.4.2 / 2019-10-10

- fix: 修复丢失d.ts的问题

## 0.4.0 / 2019-3-2

- 增加.d.ts文件，支持ts调用

## 0.3.1 / 2019-3-2

- fix: 修复`cloneJSON`ie8下报错

## 0.3.0 / 2018-10-18

- 高级浏览器下，引入weakmap，将`cloneForce`性能提升100%

## 0.2.0 / 2018-10-17

- 将`cloneForce`性能由O(n^2)优化到O(n)

## 0.1.1 / 2018-10-14

- 修复`cloneForce` 提前终止循环的bug

## 0.1.0 / 2018-10-10

- 添加 `clone()`
- 添加 `cloneJSON()`
- 添加 `cloneLoop()`
- 添加 `cloneForce()`
