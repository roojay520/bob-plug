interface ICore {
    $http: Bob.Http;
    $info: Bob.Info;
    $log: Bob.Log;
    $data: Bob.Data;
    $file: Bob.File;
    getOption: (key: string) => string;
}
declare var Core: Readonly<ICore>;
export default Core;
