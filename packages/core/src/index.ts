import Core from './core';
import Util from './util';
import Cache from './cache';
import CacheResult from './cache-result';

const Bob = { ...Core, Util, Cache, CacheResult };
export default Bob;

export { Core, Util, Cache, CacheResult };
