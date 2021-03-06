import { ServiceErrorType, ServiceError } from './bob-types.d';

export declare function error(type?: ServiceErrorType, message?: string, addtion?: any): ServiceError;
export declare var isArray: (val: any) => boolean;
export declare var isArrayAndLenGt: (val: any, len?: number) => boolean;
export declare var isString: (val: any) => boolean;
export declare var isPlainObject: (val: any) => boolean;
export declare var isNil: (val: any) => boolean;
export declare function deepClone(obj: any): any;
export declare function getType(v: any): string;
export declare function asyncTo<T, U = any>(promise: Promise<T>, errorExt?: Record<string, unknown>): Promise<[U | null, T | undefined]>;
declare const _default: {
    error: typeof error;
    isString: (val: any) => boolean;
    isArray: (val: any) => boolean;
    isNil: (val: any) => boolean;
    isArrayAndLenGt: (val: any, len?: number) => boolean;
    isPlainObject: (val: any) => boolean;
    deepClone: typeof deepClone;
    getType: typeof getType;
    asyncTo: typeof asyncTo;
};
export default _default;
