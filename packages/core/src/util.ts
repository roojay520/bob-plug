export function error(
  type: Bob.ServiceErrorType = 'unknown',
  message = '插件出错',
  addtion: any = {},
): Bob.ServiceError {
  return {
    type,
    message,
    addtion: JSON.stringify(addtion),
  };
}

export var isArray = (val: any) => Array.isArray(val);
export var isArrayAndLenGt = (val: any, len = 0) => isArray(val) && val.length > len;
export var isString = (val: any) => typeof val === 'string';
export var isPlainObject = (val: any) => !!val && typeof val === 'object' && val.constructor === Object;
export var isNil = (val: any) => val === undefined || val === null;

export function deepClone(obj: any) {
  if (!isPlainObject(obj)) return obj;
  const clone = { ...obj };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  Object.keys(clone).forEach((key) => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Array.isArray(obj) ? (clone.length = obj.length) && Array.from(clone) : clone;
}

export function getType(v: any) {
  return Reflect.toString.call(v).slice(8, -1).toLowerCase();
}

export async function asyncTo<T, U = any>(
  promise: Promise<T>,
  errorExt?: Record<string, unknown>,
): Promise<[U | null, T | undefined]> {
  try {
    const data = await promise;
    const result: [null, T] = [null, data];
    return result;
  } catch (_err) {
    let err: any = _err;
    if (errorExt) {
      Object.assign(err, errorExt);
    }
    const resultArr: [U, undefined] = [err, undefined];
    return resultArr;
  }
}

export default {
  error,
  isString,
  isArray,
  isNil,
  isArrayAndLenGt,
  isPlainObject,
  deepClone,
  getType,
  asyncTo,
};
