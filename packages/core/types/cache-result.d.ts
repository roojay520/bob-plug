/**
 * @description 根据翻译文字的 md5 值缓存翻译结果
 * 注意: 貌似插件不支持 ES6 的 Map Set 数据结构, 暂时先用对象
 * @export
 * @class CacheResult
 */
export default class CacheResult {
    /**
     * Creates an instance of CacheResult.
     * @memberof CacheResult
     */
    private _resultCacheStore;
    private _result;
    constructor(nameSpace?: string);
    _save(): void;
    get(key: string): any;
    set(key: string, val: any): void;
    clear(): void;
}
