import { Http, Info, Log, Data, File } from './bob-types';

interface IApi {
  $http: Http;
  $info: Info;
  $log: Log;
  $data: Data;
  $file: File;
  getOption: (key: string) => string;
}

var api: Readonly<IApi> = {
  $http,
  $info,
  $log,
  $data,
  $file,
  // 无法实时监听 $option 变化, 采用方法动态获取 $option 的值
  getOption: (key: string): string => $option[key],
};

export default api;
