import { Http, Info, Log, Data, File } from './bob-types';
interface IApi {
    $http: Http;
    $info: Info;
    $log: Log;
    $data: Data;
    $file: File;
    getOption: (key: string) => string;
}
declare var api: Readonly<IApi>;
export default api;
