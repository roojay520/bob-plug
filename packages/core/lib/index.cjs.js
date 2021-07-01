'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Core = {
  $http,
  $info,
  $log,
  $data,
  $file,
  getOption: (key) => $option[key]
};

var __defProp$2 = Object.defineProperty;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    }
  return a;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
function error(type = "unknown", message = "\u63D2\u4EF6\u51FA\u9519", addtion = {}) {
  return {
    type,
    message,
    addtion: JSON.stringify(addtion)
  };
}
var isArray = (val) => Array.isArray(val);
var isArrayAndLenGt = (val, len = 0) => isArray(val) && val.length > len;
var isString = (val) => typeof val === "string";
var isPlainObject = (val) => !!val && typeof val === "object" && val.constructor === Object;
var isNil = (val) => val === void 0 || val === null;
function deepClone(obj) {
  if (!isPlainObject)
    return obj;
  const clone = __spreadValues$2({}, obj);
  Object.keys(clone).forEach((key) => clone[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key]);
  return Array.isArray(obj) ? (clone.length = obj.length) && Array.from(clone) : clone;
}
function getType(v) {
  return Reflect.toString.call(v).slice(8, -1).toLowerCase();
}
function asyncTo(promise, errorExt) {
  return __async(this, null, function* () {
    try {
      const data = yield promise;
      const result = [null, data];
      return result;
    } catch (_err) {
      let err = _err;
      if (errorExt) {
        Object.assign(err, errorExt);
      }
      const resultArr = [err, void 0];
      return resultArr;
    }
  });
}
var Util = {
  error,
  isString,
  isArray,
  isNil,
  isArrayAndLenGt,
  isPlainObject,
  deepClone,
  getType,
  asyncTo
};

class Cache {
  constructor(nameSpace = "bobplug-cache") {
    this._cacheFilePath = "";
    this._store = {};
    this._cacheFilePath = `$sandbox/cache/${nameSpace}.json`;
    this._read();
  }
  _write() {
    const json = JSON.stringify(this._store);
    Core.$file.write({
      data: Core.$data.fromUTF8(json),
      path: this._cacheFilePath
    });
  }
  _read() {
    var exists = Core.$file.exists(this._cacheFilePath);
    if (exists) {
      var data = Core.$file.read(this._cacheFilePath);
      this._store = JSON.parse(data.toUTF8());
    } else {
      this._store = {};
      this._write();
    }
  }
  set(key, value) {
    if (!isString(key))
      return;
    this._store[key] = value;
    this._write();
  }
  get(key) {
    if (!isString(key))
      return null;
    return this._store[key];
  }
  getAll() {
    return this._store;
  }
  remove(key) {
    if (!isString(key))
      return;
    delete this._store[key];
    this._write();
  }
  clear() {
    this._store = {};
    this._write();
  }
}

var __defProp$1 = Object.defineProperty;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var CryptoJS = require("crypto-js");
class CacheResult {
  constructor() {
    this._resultCacheStore = new Cache("result-cache");
    let result = this._resultCacheStore.get("result") || {};
    if (!Util.isPlainObject(result))
      result = {};
    this._result = result;
  }
  _save() {
    this._resultCacheStore.set("result", __spreadValues$1({}, this._result));
  }
  get(key) {
    if (!Util.isString(key))
      return null;
    const md5 = CryptoJS.MD5(key).toString();
    const result = this._result[md5];
    if (!Util.isPlainObject(result))
      return null;
    const { time, data } = result;
    const cacheUpdateTime = 1e3 * 60 * 60 * 24 * 7;
    if (Date.now() - cacheUpdateTime > time) {
      delete this._result[md5];
      this._save();
      return null;
    }
    return data;
  }
  set(key, val) {
    if (!Util.isString(key) && !Util.isPlainObject(val) && !Util.isArrayAndLenGt(val.toParagraphs, 0))
      return;
    const md5 = CryptoJS.MD5(key).toString();
    const result = { time: Date.now(), data: val };
    this._result[md5] = result;
    this._save();
  }
  clear() {
    this._resultCacheStore.clear();
  }
}

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const Bob = __spreadProps(__spreadValues({}, Core), { Util, Cache, CacheResult });

exports.Cache = Cache;
exports.CacheResult = CacheResult;
exports.Core = Core;
exports.Util = Util;
exports.default = Bob;
