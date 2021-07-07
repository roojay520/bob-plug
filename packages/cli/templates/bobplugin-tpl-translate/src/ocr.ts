import * as Bob from '@bob-plug/core';

interface QueryOption {
  from?: Bob.Language;
  detectFrom?: Bob.Language;
  cache?: string;
}

var resultCache = new Bob.CacheResult('ocr-result');
async function _ocr(image: Bob.DataObject, options: QueryOption = {}): Promise<Bob.OcrResult> {
  const { from = 'auto', cache = 'enable' } = options;
  // 缓存
  const cacheKey = `${image.toBase64()}`;
  if (cache === 'enable') {
    const _cacheData = resultCache.get(cacheKey);
    if (_cacheData) return _cacheData;
  } else {
    resultCache.clear();
  }

  // https://ripperhe.gitee.io/bob/#/plugin/object/ocrresult
  let result: Bob.OcrResult = { from: from, texts: [], raw: {} };
  try {
    // 在此处实现ocr的具体处理逻辑
    result = {
      from: from,
      texts: [{ text: '测试文字' }],
      raw: {},
    };
  } catch (error) {
    throw Bob.util.error('api', '数据解析错误出错', error);
  }

  if (cache === 'enable') {
    resultCache.set(cacheKey, result);
  }
  return result;
}

export { _ocr };
