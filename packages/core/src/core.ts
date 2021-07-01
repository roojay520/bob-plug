interface ICore {
  $http: Bob.Http;
  $info: Bob.Info;
  $log: Bob.Log;
  $data: Bob.Data;
  $file: Bob.File;
  getOption: (key: string) => string;
}

var core: Readonly<ICore> = {
  $http,
  $info,
  $log,
  $data,
  $file,
  // 无法实时监听 $option 变化, 采用方法动态获取 $option 的值
  getOption: (key: string): string => $option[key],
};

export default core;
