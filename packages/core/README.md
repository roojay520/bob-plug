# `@bob-plug/core`

> Bob 核心类型以及部分工具方法集合

## 特性

- 根据 [Bob](https://ripperhe.gitee.io/bob/#/) 文档封装所有类型;
- 支持 TypeScript 类型提示;

## 基础使用

```bash
yarn add @bob-plug/core
```

```ts
// main.ts
import * as Bob from '@bob-plug/core';
import { _translate } from './translate';
// https://ripperhe.gitee.io/bob/#/plugin/quickstart/translate
export function translate(query: Bob.TranslateQuery, completion: Bob.Completion) {
  const { text = '', detectFrom, detectTo } = query;
  const params = { from: detectFrom, to: detectTo, cache: Bob.api.getOption('cache') };
  _translate(text, params)
    .then((result) => completion({ result }))
    .catch((error) => {
      Bob.api.$log.error(JSON.stringify(error));
      if (error?.type) return completion({ error });
      completion({ error: Bob.util.error('api', '插件出错', error) });
    });
}

// translate.ts
import * as Bob from '@bob-plug/core';

interface QueryOption {
  to?: Bob.Language;
  from?: Bob.Language;
  cache?: string;
}
var resultCache = new Bob.CacheResult('translate-result');
/**
 * @description 翻译
 * @param {string} text 需要翻译的文字内容
 * @param {object} [options={}]
 * @return {object} 一个符合 bob 识别的翻译结果对象
 */
async function _translate(text: string, options: QueryOption = {}): Promise<Bob.TranslateResult> {
  const { from = 'auto', to = 'auto', cache = 'enable' } = options;
  const cacheKey = `${text}${from}${to}`;
  if (cache === 'enable') {
    const _cacheData = resultCache.get(cacheKey);
    if (_cacheData) return _cacheData;
  } else {
    resultCache.clear();
  }
  const result: Bob.TranslateResult = { from, to, toParagraphs: [] };
  try {
    // 在此处实现翻译的具体处理逻辑
    result.toParagraphs = ['测试文字'];
    result.fromParagraphs = [];
    // result.toDict = { parts: [], phonetics: [] };
  } catch (error) {
    throw Bob.util.error('api', '数据解析错误出错', error);
  }
  if (cache === 'enable') {
    resultCache.set(cacheKey, result);
  }
  return result;
}
export { _translate };
```

## Modules

```ts
import { api, util, Cache, CacheResult } from '@bob-plug/core';
```

- api [Bob 核心内置类](https://ripperhe.gitee.io/bob/#/plugin/api/option)
  - `api.$data`
  - `api.$file`
  - `api.$http`
  - `api.$info`
  - `api.$log`
  - `api.getOption: (key: string) => string` 直接使用 `$option` 时无法获取到用户的配置更新操作;
- util 工具方法
  - `function error(type?: Bob.ServiceErrorType, message?: string, addtion?: any): Bob.ServiceError`
  - `function isArray(val: any): boolean`
  - `function isArrayAndLenGt(val: any, len?: number): boolean`
  - `function isString(val: any): boolean`
  - `function isPlainObject(val: any): boolean`
  - `function isNil(val: any): boolean`
  - `function deepClone(obj: any): any`
  - `function getType(v: any): string`
  - `function asyncTo<T, U = any>(promise: Promise<T>, errorExt?: Record<string, unknown>): Promise<[U | null, T | undefined]>`
- Cache 类

  ```ts
  class Cache {
    constructor(nameSpace?: string);
    set(key: string, value: any): void;
    get(key: string): any;
    getAll(): Store;
    remove(key: string): void;
    clear(): void;
  }
  ```

- CacheResult 类

  ```ts
  class CacheResult {
    constructor(nameSpace?: string);
    get(key: string): any;
    set(key: string, val: any): void;
    clear(): void;
  }
  ```

- 其它类型提示相关定义 [bob-types.d.ts](./src/bob-types.d.ts)
