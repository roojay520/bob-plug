interface Store {
    [propName: string]: any;
}
/**
 * @description 数据缓存
 * @export
 * @class Cache
 */
export default class Cache {
    /**
     * Creates an instance of Cache.
     * @param {string} [nameSpace='bobplug-cache'] 命名空间
     * @memberof Cache
     */
    private _store;
    private _cacheFilePath;
    constructor(nameSpace?: string);
    _write(): void;
    _read(): void;
    set(key: string, value: any): void;
    get(key: string): any;
    getAll(): Store;
    remove(key: string): void;
    clear(): void;
}
export {};
